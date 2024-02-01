import { Router } from "express";
import userStore from "@/models/users.model.js";
import sessionStore from "@/models/sessions.model.js";
import { signJWT, verifyJWT } from "@/utils/jwt.js";
import {
	mustBeAdmin,
	mustLogin,
	validateBody,
	validateQuery,
} from "@/middlewares/index.js";
import { collectFileters } from "@/helpers/index.js";
import {
	loginSchema,
	notifyUsersSchema,
	newUserSchema,
	updateNotificationTokenSchema,
	updatePasswordSchema,
	notifyUserSchema,
} from "@/schemas/users.schema.js";
import { querySchema } from "@/schemas/query.schema.js";
import { env } from "@/config/env.js";
import { comparePassword } from "@/utils/hash.js";
import { routerError } from "@/helpers/index.js";
import { parseUserAgent } from "@/helpers/session.js";
import { sendNotifications } from "@/helpers/notifications.js";

import type { User } from "@prisma/client";

const router = Router();

router.post("/register", async (_req, res) => {
	res.status(400).json({
		error: "BAD_REQUEST",
		message:
			"use /register/<account_type>\n where <account_type> is one of: student, teacher, controller, admin",
	});
});

router.post(
	"/register/:accountType",
	validateBody(newUserSchema),
	async (req, res) => {
		const accountType = req.params.accountType;
		const accountTypeToStore: Record<string, (data: any) => Promise<User>> =
			{
				student: userStore.createStudent,
				teacher: userStore.createTeacher,
				controller: userStore.createController,
				security: userStore.createSecurity,
				admin: userStore.createAdmin,
			};

		try {
			if (!Object.keys(accountTypeToStore).includes(accountType)) {
				res.status(400).json({
					error: "BAD_REQUEST",
					message: "Invalid account type",
				});
				return;
			}

			const user = await accountTypeToStore[accountType](req.body);
			res.status(201).json(user);
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

router.post("/login", validateBody(loginSchema), async (req, res) => {
	try {
		const user = await userStore.authenticateUser(
			req.body.username,
			req.body.password
		);

		const device = parseUserAgent(req.headers["user-agent"]);
		const session = await sessionStore.create(user.id, device);

		const accessToken = signJWT(
			{ user: { ...user, sid: session.id } },
			env.NODE_ENV === "production" ? "5m" : "1h"
		);
		const refreshToken = signJWT({ sessionId: session.id }, "30d");
		res.cookie("refreshToken", refreshToken, {
			maxAge: 2592000000, // 30 days
			httpOnly: true,
			sameSite: env.NODE_ENV === "production" ? "none" : "lax",
			secure: env.NODE_ENV === "production",
		});

		res.json({ accessToken, user });
	} catch (err: any) {
		routerError(err, res);
	}
});

router.post("/logout", async (_req, res) => {
	try {
		const { refreshToken } = _req.cookies;
		if (!refreshToken) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Missing refresh token",
			});
		}

		const { payload } = verifyJWT(refreshToken);
		if (payload?.sessionId) {
			await sessionStore.invalidate(payload.sessionId);
		} else {
			throw new Error("No session id in refresh token");
		}
		res.clearCookie("refreshToken");
		res.sendStatus(200);
	} catch (err) {
		// ignore error
		res.clearCookie("refreshToken");
		res.sendStatus(200);
	}
});

router.get("/refresh-token", async (req, res) => {
	try {
		const { refreshToken } = req.cookies;
		if (!refreshToken) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Missing refresh token",
			});
		}

		const { payload, expired } = verifyJWT(refreshToken);
		if (expired) {
			// TODO: invalidate session in db
			if (payload?.sessionId) {
				await sessionStore.invalidate(payload.sessionId);
			} else {
				throw new Error("No session id in refresh token");
			}
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Refresh token expired",
			});
		}

		if (!payload?.sessionId) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Invalid refresh token",
			});
		}

		const session = await sessionStore.get(payload.sessionId);
		if (!session) {
			return res
				.status(401)
				.json({ error: "UNAUTHORIZED", message: "Login expired" });
		}

		// Not awaiting on purpose
		sessionStore.updateDevice(
			session.id,
			parseUserAgent(req.headers["user-agent"])
		);

		const user = await userStore.getUserById(session.userId);

		const accessToken = signJWT(
			{ user: { ...user, sid: session.id } },
			env.NODE_ENV === "production" ? "5m" : "1h"
		);

		res.json({ accessToken });
	} catch {
		res.clearCookie("refreshToken");
		res.status(400).json({
			error: "BAD_REQUEST",
			message: "Invalid session",
		});
	}
});

router.get("/me", mustLogin, (_req, res) => {
	res.json(res.locals.user);
});

router.get("/", mustBeAdmin, validateQuery(querySchema), async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 50;
		const page = Number(req.query.page) || 1;

		const filters = collectFileters(req.query);

		const users = await userStore.index({ limit, page, filters });

		res.json(users);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.get("/:id", mustLogin, async (req, res) => {
	try {
		const user = await userStore.getUserById(req.params.id);
		res.json(user);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		if (
			req.params.id !== res.locals.user.id &&
			res.locals.user.role !== "admin"
		) {
			return res.status(401).json({
				error: "UNAUTHORIZED",
				message: "You can only delete your own account",
			});
		}
		await userStore.deleteUser(req.params.id);
		res.sendStatus(200);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.put(
	"/password",
	mustLogin,
	validateBody(updatePasswordSchema),
	async (req, res) => {
		try {
			const oldPassword = await userStore.getUserPasswordById(
				res.locals.user.id
			);
			const isMatch = await comparePassword(
				req.body.oldPassword,
				oldPassword
			);

			if (!isMatch) {
				return res.status(401).json({
					error: "UNAUTHORIZED",
					message: "Old password is incorrect",
				});
			}

			await userStore.updatePassword(
				res.locals.user.id,
				req.body.newPassword
			);

			// await sessionsModel.invalidateAllByUser(res.locals.user.id);
			res.cookie("refreshToken", "", {
				maxAge: 0,
				httpOnly: true,
				sameSite: env.NODE_ENV === "production" ? "none" : "lax",
				secure: env.NODE_ENV === "production",
			});

			res.sendStatus(200);
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

router.post(
	"/notifications",
	mustLogin,
	validateBody(updateNotificationTokenSchema),
	async (req, res) => {
		try {
			await sessionStore.updateNotificationToken(
				res.locals.user.sid,
				req.body.token
			);
			res.sendStatus(200);
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

router.post(
	"/notify",
	mustBeAdmin,
	validateBody(notifyUsersSchema),
	async (req, res) => {
		try {
			const { title, body, userIds, all } = req.body;

			const notificationTokenObjects =
				(all
					? await sessionStore.getAllNotificationTokens()
					: await Promise.all(
							userIds.map((userId: string) =>
								sessionStore.getNotificationTokensByUser(userId)
							)
						)) ?? [];

			const notificationTokens = notificationTokenObjects
				.flatMap((tokens) => tokens)
				.map((token) => token.notificationToken);

			// TODO: maybe save ticket ids in db
			await sendNotifications(notificationTokens, {
				title,
				body,
			});

			res.json({
				status: "success",
				message: `Notification sent to ${notificationTokens.length} device(s)`,
			});
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

router.post(
	"/:userId/notify",
	mustBeAdmin,
	validateBody(notifyUserSchema),
	async (req, res) => {
		try {
			const { title, body } = req.body;
			const notificationTokenObjects =
				await sessionStore.getNotificationTokensByUser(
					req.params.userId
				);

			if (!notificationTokenObjects?.length) {
				return res.status(404).json({
					error: "NOT_FOUND",
					message: "User has no notification tokens",
				});
			}

			const notificationTokens = notificationTokenObjects
				.map((token) => token.notificationToken)
				.filter((token) => token !== null) as string[];

			if (notificationTokens.length === 0) {
				return res.status(404).json({
					error: "NOT_FOUND",
					message: "User has no notification tokens",
				});
			}

			await sendNotifications(notificationTokens, {
				title,
				body,
			});

			res.json({
				status: "success",
				message: `Notification sent to ${notificationTokens.length} device(s)`,
			});
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

export default router;

import { Router } from "express";
import userStore from "@/models/users.model";
import sessionStore from "@/models/sessions.model";
import { signJWT, verifyJWT } from "@/utils/jwt";
import { mustBe, mustLogin, validateBody, validateQuery } from "@/middlewares";
import { collectFileters } from "@/helpers";
import {
	loginSchema,
	notifyUsersSchema,
	newUserSchema,
	updateNotificationTokenSchema,
	updatePasswordSchema,
	notifyUserSchema,
	newControllerSchema,
	updatelicensePlateSchema,
} from "@/schemas/users.schema";
import { querySchema } from "@/schemas/query.schema";
import { env } from "@/config/env";
import { comparePassword } from "@/utils/hash";
import { formatError, formatResponse } from "@/helpers";
import { parseUserAgent } from "@/helpers/session";
import { sendNotifications } from "@/helpers/notifications";

import type { RegisterReturn } from "@/models/users.model";
import { z } from "zod";

const router = Router();

router.post(
	"/register/controller",
	mustBe("admin"),
	validateBody(newControllerSchema),
	async (req, res) => {
		try {
			const user = await userStore.createController(
				req.body.user,
				req.body.controller
			);

			res.status(201).json(formatResponse(user));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post(
	"/register/:accountType",
	validateBody(newUserSchema),
	async (req, res) => {
		const accountType = req.params.accountType;
		const accountTypeToStore: Record<
			string,
			(data: any) => Promise<RegisterReturn>
		> = {
			student: userStore.createStudent,
			teacher: userStore.createTeacher,
			security: userStore.createSecurity,
		};

		try {
			if (!Object.keys(accountTypeToStore).includes(accountType)) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: "Invalid account type",
				});
			}

			const user = await accountTypeToStore[accountType](req.body);

			res.status(201).json(formatResponse(user));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
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

		res.json(formatResponse({ accessToken, user }));
	} catch (err: any) {
		res.status(401).json({
			error: "UNAUTHORIZED",
			message: "Invalid credentials",
		});
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

		res.json(formatResponse({ accessToken }));
	} catch {
		res.clearCookie("refreshToken");
		res.status(400).json({
			error: "BAD_REQUEST",
			message: "Invalid session",
		});
	}
});

router.get("/me", mustLogin, (_req, res) => {
	res.json(formatResponse(res.locals.user));
});

router.get(
	"/",
	mustBe("admin"),
	validateQuery(querySchema),
	async (req, res) => {
		try {
			const limit = Number(req.query.limit) || 50;
			const page = Number(req.query.page) || 1;

			const filters = collectFileters(req.query);

			const users = await userStore.index({ limit, page, filters });

			res.json(formatResponse(users));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/:id", mustLogin, async (req, res) => {
	try {
		const user = await userStore.getUserById(req.params.id);
		res.json(formatResponse(user));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put(
	"/license-plate",
	mustBe(["admin", "teacher"]),
	validateBody(updatelicensePlateSchema),
	async (req, res) => {
		const body = req.body as z.infer<typeof updatelicensePlateSchema>;
		try {
			await userStore.updatelicensePlate(
				res.locals.user.id,
				body.licensePlate
			);
			res.sendStatus(204);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete(
	"/license-plate",
	mustBe(["admin", "teacher"]),
	async (req, res) => {
		try {
			await userStore.deletelicensePlate(res.locals.user.id);
			res.sendStatus(204);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

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
		const { status, error } = formatError(err);
		res.status(status).json(error);
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

			await sessionStore.invalidateAllByUser(res.locals.user.id);
			res.cookie("refreshToken", "", {
				maxAge: 0,
				httpOnly: true,
				sameSite: env.NODE_ENV === "production" ? "none" : "lax",
				secure: env.NODE_ENV === "production",
			});

			res.sendStatus(200);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
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
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post(
	"/notify",
	mustBe("admin"),
	validateBody(notifyUsersSchema),
	async (req, res) => {
		try {
			const { title, body, userIds, all } = req.body;

			const notificationTokens = all
				? await sessionStore.getAllNotificationTokens()
				: await Promise.all(
						userIds.map((userId: string) =>
							sessionStore.getNotificationTokensByUser(userId)
						)
					).then((tokens) => tokens.flat());

			// TODO: maybe save ticket ids in db
			await sendNotifications(notificationTokens, {
				title,
				body,
			});

			res.json(
				formatResponse({
					status: "success",
					message: `Notification sent to ${notificationTokens.length} device(s)`,
				})
			);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post(
	"/:userId/notify",
	mustBe("admin"),
	validateBody(notifyUserSchema),
	async (req, res) => {
		try {
			const { title, body } = req.body;
			const notificationTokens =
				await sessionStore.getNotificationTokensByUser(
					req.params.userId
				);

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
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

export default router;

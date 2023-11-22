import { Router } from "express";
import userStore from "@/models/users.model";
import { signJWT, verifyJWT } from "@/utils/jwt.js";
import type { User } from "@prisma/client";
import {
	mustBeAdmin,
	mustLogin,
	validateBody,
	validateQuery,
} from "@/middlewares";
import { collectFileters } from "@/helpers";
import { loginSchema, newUserSchema } from "@/schemas/users.schema";
import { querySchema } from "@/schemas/query.schema";

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
			// console.error(err.httpStatus ? err.originalError : err);
			if (err.httpStatus)
				res.status(err.httpStatus).json({
					error: err.longMessage,
					message: err.simpleMessage,
				});
			else
				res.status(500).json({
					error: "INTERNAL_SERVER_ERROR",
					message: err.message,
				});
		}
	}
);

router.post("/login", validateBody(loginSchema), async (req, res) => {
	try {
		if (!req.body.username || !req.body.password) {
			res.status(400).json({
				error: "Bad request",
				message: "Missing username or password",
			});
			return;
		}
		const user = await userStore.authenticateUser(
			req.body.username,
			req.body.password
		);

		const accessToken = signJWT({ user }, "5m");
		const refreshToken = signJWT({ userId: user.id }, "30d");
		res.cookie("refreshToken", refreshToken, {
			maxAge: 2592000000, // 30 days
			httpOnly: true,
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			secure: process.env.NODE_ENV === "production",
		});

		res.json({ accessToken, user });
	} catch (err: any) {
		if (err.httpStatus)
			res.status(err.httpStatus).json({
				error: err.longMessage,
				message: err.simpleMessage,
			});
		else
			res.status(500).json({
				error: "INTERNAL_SERVER_ERROR",
				message: err.message,
			});
	}
});

router.post("/logout", async (_req, res) => {
	res.clearCookie("refreshToken");
	res.sendStatus(200);
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
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Refresh token expired",
			});
		}

		if (!payload?.userId) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Invalid refresh token",
			});
		}

		const user = await userStore.getUserById(payload.userId);
		if (!user) {
			return res
				.status(401)
				.json({ error: "UNAUTHORIZED", message: "Login expired" });
		}

		const accessToken = signJWT({ user }, "5m");

		res.json({ accessToken });
	} catch {
		return res.status(400).json({
			error: "BAD_REQUEST",
			message: "Invalid refresh token",
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

		const users = await userStore.index({ count: limit, page, filters });

		res.json(users);
	} catch (err: any) {
		if (err.httpStatus)
			res.status(err.httpStatus).json({
				error: err.longMessage,
				message: err.simpleMessage,
			});
		else
			res.status(500).json({
				error: "INTERNAL_SERVER_ERROR",
				message: err.message,
			});
	}
});

router.get("/:id", mustLogin, async (req, res) => {
	try {
		const user = await userStore.getUserById(req.params.id);
		res.json(user);
	} catch (err: any) {
		if (err.httpStatus)
			res.status(err.httpStatus).json({
				error: err.longMessage,
				message: err.simpleMessage,
			});
		else
			res.status(500).json({
				error: "INTERNAL_SERVER_ERROR",
				message: err.message,
			});
	}
});

export default router;

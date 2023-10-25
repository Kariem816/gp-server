import { Router } from "express";
import userStore from "@/models/users.model";
import { signJWT, verifyJWT } from "@/utils/jwt.js";

const router = Router();

router.post("/register", async (_req, res) => {
	res.status(400).json({
		error: "BAD_REQUEST",
		message:
			"use /register/<account_type>\n where <account_type> is one of: student, teacher, controller, admin",
	});
});

router.post("/register/:accountType", async (req, res) => {
	const accountType = req.params.accountType;
	const accountTypeToStore: Record<string, (data: any) => void> = {
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
});

router.post("/login", async (req, res) => {
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

		res.json({ accessToken });
	} catch (err: any) {
		if (err.httpStatus)
			res.status(err.httpStatus).json({
				error: err.longMessage,
				message: err.simpleMessage,
			});
		else
			res.status(500).json({
				error: "Internal server error",
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
		const refreshToken = req.cookies.refreshToken;
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

		const accessToken = signJWT({ user }, "5m");

		res.json({ accessToken });
	} catch {
		return res.status(400).json({
			error: "BAD_REQUEST",
			message: "Invalid refresh token",
		});
	}
});

// for debugging purposes only
router.get("/server-status", async (req, res) => {
	try {
		res.json({
			status: "OK",
			uptime: process.uptime(),
		});
	} catch (err: any) {
		res.json({
			status: "ERROR",
		});
	}
});

export default router;

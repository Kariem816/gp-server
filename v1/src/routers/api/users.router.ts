import userStore from "@/models/users.model";
import { Router } from "express";

const router = Router();

router.post("/register", async (req, res) => {
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
		const { username, password, name } = req.body;
		if (!username || !password || !name) {
			// return res.status(400).json({
			// 	error: "BAD_REQUEST",
			// 	message: "Missing Input Fields",
			// });
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

		res.status(200).json(user);
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

export default router;

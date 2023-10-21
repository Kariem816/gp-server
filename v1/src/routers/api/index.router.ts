import { Router } from "express";

import usersRouter from "./users.router";

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		data: { message: "Hello World!" },
	});
});

router.use("/users", usersRouter);

router.use((_req, res) => {
	res.status(404).json({
		error: "NOT_FOUND",
		message: "The requested resource was not found",
	});
});

export default router;

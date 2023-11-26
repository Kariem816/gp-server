import { Router } from "express";

import usersRouter from "./users.router";
import coursesRouter from "./courses.router";
import lecturesRouter from "./lectures.router";
import studentRouter from "./student.router";

import { getCourseProfile } from "@/middlewares";

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		data: { message: "Hello World!" },
	});
});

router.use("/users", usersRouter);
router.use("/courses", getCourseProfile, coursesRouter);
router.use("/students", getCourseProfile, studentRouter);
router.use("/lectures", lecturesRouter);

router.use((_req, res) => {
	res.status(404).json({
		error: "NOT_FOUND",
		message: "The requested resource was not found",
	});
});

export default router;

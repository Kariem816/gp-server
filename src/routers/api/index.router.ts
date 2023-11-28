import { Router } from "express";

import usersRouter from "./users.router";
import coursesRouter from "./courses.router";
import lecturesRouter from "./lectures.router";
import studentRouter from "./student.router";
import teachersRouter from "./teachers.router";

import { getCourseProfile, mustLogin } from "@/middlewares";
import { mustBeCourseTeacher, saveCourseId } from "@/middlewares/lectures";

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		data: { message: "You Shouldn't Be HERE!!" },
	});
});

router.use("/users", usersRouter);
router.use("/courses", getCourseProfile, coursesRouter);
router.use(
	"/courses/:courseId/lectures",
	saveCourseId,
	getCourseProfile,
	mustBeCourseTeacher,
	lecturesRouter
);
router.use("/students", getCourseProfile, studentRouter);
router.use("/teachers", mustLogin, teachersRouter);

router.use((_req, res) => {
	res.status(404).json({
		error: "NOT_FOUND",
		message: "The requested resource was not found",
	});
});

export default router;

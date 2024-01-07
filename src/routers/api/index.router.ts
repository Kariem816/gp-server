import { Router } from "express";

import usersRouter from "./users.router.js";
import coursesRouter from "./courses.router.js";
import lecturesRouter from "./lectures.router.js";
import studentRouter from "./student.router.js";
import teachersRouter from "./teachers.router.js";

import trashRouter from "./trash.router.js";

import uploadsRouter from "./uploads.router.js";

import {
	getCourseProfile,
	mustBeAdminOrTeacher,
	mustLogin,
} from "@/middlewares/index.js";

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		data: { message: "You Shouldn't Be HERE!!" },
	});
});

router.use("/users", usersRouter);
router.use("/courses", getCourseProfile, coursesRouter);
router.use("/lectures", mustBeAdminOrTeacher, getCourseProfile, lecturesRouter);
router.use("/students", getCourseProfile, studentRouter);
router.use("/teachers", mustLogin, teachersRouter);

router.use("/trash", trashRouter);

router.use("/uploads", uploadsRouter);

router.use((_req, res) => {
	res.status(404).json({
		error: "NOT_FOUND",
		message: "The requested resource was not found",
	});
});

export default router;

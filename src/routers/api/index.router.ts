import { Router } from "express";

import usersRouter from "./users.router";
import coursesRouter from "./courses.router";
import lecturesRouter from "./lectures.router";
import studentRouter from "./student.router";
import teachersRouter from "./teachers.router";

import controllersRouter from "./controllers.router";
import trashRouter from "./trash.router";
import irrigationRouter from "./irrigation.router";

import uploadsRouter from "./uploads.router";
import mobileRouter from "./mobile.router";

import graphRouter_temp from "./graph.router.temp";

import { getCourseProfile, mustBe, mustLogin } from "@/middlewares";

const router = Router();

router.get("/", (_req, res) => {
	res.json({
		data: {
			message: "I came from server",
			status: "OK",
			time: new Date().toLocaleTimeString(),
		},
	});
});

router.use("/users", usersRouter);
router.use("/courses", getCourseProfile, coursesRouter);
router.use(
	"/lectures",
	mustLogin,
	mustBe(["admin", "teacher", "controller"]),
	getCourseProfile,
	lecturesRouter
);
router.use("/students", getCourseProfile, studentRouter);
router.use("/teachers", mustLogin, teachersRouter);

router.use("/controllers", controllersRouter);
router.use("/trash", trashRouter);
router.use("/irrigation", irrigationRouter);

router.use("/uploads", uploadsRouter);
router.use("/mobile", mobileRouter);

router.use("/graph-temp", graphRouter_temp);

router.use((_req, res) => {
	res.status(404).json({
		error: "NOT_FOUND",
		message: "The requested resource was not found",
	});
});

export default router;

import { Router } from "express";

import usersRouter from "./users.router";
import coursesRouter from "./courses.router";
import lecturesRouter from "./lectures.router";
import studentRouter from "./student.router";
import teachersRouter from "./teachers.router";

import controllersRouter from "./controllers.router";
import trashRouter from "./trash.router";
import irrigationRouter from "./irrigation.router";
import lightingRouter from "./lighting.router";

import uploadsRouter from "./uploads.router";
import mobileRouter from "./mobile.router";
import parkingRouter from "./parking.router";
import gateRouter from "./gate.router";

import {
	getCourseProfile,
	mustBe,
	mustLogin,
	allowedController,
} from "@/middlewares";

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
router.use("/trash", allowedController("garbage"), trashRouter);
router.use("/irrigation", allowedController("irrigation"), irrigationRouter);
router.use("/lighting", allowedController("lighting"), lightingRouter);
router.use("/parking", allowedController("parking"), parkingRouter);
router.use("/gate", allowedController("gate"), gateRouter);

router.use("/uploads", uploadsRouter);
router.use("/mobile", mobileRouter);

router.use((_req, res) => {
	res.status(404).json({
		error: "NOT_FOUND",
		message: "The requested resource was not found",
	});
});

export default router;

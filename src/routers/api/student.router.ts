import { Router } from "express";
import studentStore from "@/models/student.model";
import { mustBeStudent, parseFilters } from "@/middlewares";
import { routerError } from "@/helpers/routerError";

const router = Router();

router.get("/my-courses", mustBeStudent, parseFilters, async (req, res) => {
	try {
		const studentId = res.locals.student.id;
		if (!studentId) throw new Error("Student ID not found");

		const page = parseInt(req.query.page as string) || 0;
		const limit = parseInt(req.query.limit as string) || 10;
		const filters = res.locals.filters;
		const semester = req.query.semester as string;

		const courses = await studentStore.getCourses(studentId, {
			page,
			limit,
			filters,
			semester,
		});

		res.json(courses);
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/:id/courses", parseFilters, async (req, res) => {
	try {
		const studentId = req.params.id;
		if (!(await studentStore.isStudent(studentId)))
			throw new Error("Student not found");

		const page = parseInt(req.query.page as string) || 0;
		const limit = parseInt(req.query.limit as string) || 10;
		const filters = res.locals.filters;
		const semester = req.query.semester as string;

		const courses = await studentStore.getCourses(studentId, {
			page,
			limit,
			filters,
			semester,
		});

		res.json(courses);
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/my-schedule", mustBeStudent, async (req, res) => {
	try {
		const studentId = res.locals.student.id;
		if (!studentId) throw new Error("Student ID not found");

		const until = req.query.until
			? new Date(req.query.until as string)
			: undefined;

		const schedule = await studentStore.getSchedule(studentId, until);

		res.json(schedule);
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/:id/schedule", async (req, res) => {
	try {
		const studentId = req.params.id;
		if (!(await studentStore.isStudent(studentId)))
			throw new Error("Student not found");

		const until = new Date(req.query.until as string) || undefined;

		const schedule = await studentStore.getSchedule(studentId, until);

		res.json(schedule);
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/my-attendance", mustBeStudent, async (req, res) => {
	try {
		const studentId = res.locals.student.id;
		if (!studentId) throw new Error("Student ID not found");

		const semester = (req.query.semester as string) || undefined;

		const attendance = await studentStore.getAttendance(
			studentId,
			semester
		);

		res.json(attendance);
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/:id/attendance", async (req, res) => {
	try {
		const studentId = req.params.id;
		if (!(await studentStore.isStudent(studentId)))
			throw new Error("Student not found");

		const semester = (req.query.semester as string) || undefined;

		const attendance = await studentStore.getAttendance(
			studentId,
			semester
		);

		res.json(attendance);
	} catch (err) {
		routerError(err, res);
	}
});

export default router;

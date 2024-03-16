import { Router } from "express";
import studentStore from "@/models/student.model";
import { mustBe, parseFilters } from "@/middlewares";
import { formatError, formatResponse } from "@/helpers/response";

const router = Router();

router.get("/my-courses", mustBe("student"), parseFilters, async (req, res) => {
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

		res.json(formatResponse(courses));
	} catch (err) {
		formatError(err);
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

		res.json(formatResponse(courses));
	} catch (err) {
		formatError(err);
	}
});

router.get("/my-schedule", mustBe("student"), async (req, res) => {
	try {
		const studentId = res.locals.student.id;
		if (!studentId) throw new Error("Student ID not found");

		const until = req.query.until
			? new Date(req.query.until as string)
			: undefined;

		const schedule = await studentStore.getSchedule(studentId, until);

		res.json(formatResponse(schedule));
	} catch (err) {
		formatError(err);
	}
});

router.get("/:id/schedule", async (req, res) => {
	try {
		const studentId = req.params.id;
		if (!(await studentStore.isStudent(studentId)))
			throw new Error("Student not found");

		const until = new Date(req.query.until as string) || undefined;

		const schedule = await studentStore.getSchedule(studentId, until);

		res.json(formatResponse(schedule));
	} catch (err) {
		formatError(err);
	}
});

router.get("/my-attendance", mustBe("student"), async (req, res) => {
	try {
		const studentId = res.locals.student.id;
		if (!studentId) throw new Error("Student ID not found");

		const semester = (req.query.semester as string) || undefined;

		const attendance = await studentStore.getAttendance(
			studentId,
			semester
		);

		res.json(formatResponse(attendance));
	} catch (err) {
		formatError(err);
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

		res.json(formatResponse(attendance));
	} catch (err) {
		formatError(err);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const student = await studentStore.show(req.params.id);
		res.json(formatResponse(student));
	} catch (err) {
		formatError(err);
	}
});

router.get("/profile/:id", async (req, res) => {
	try {
		const studentProfile = await studentStore.getCourseProfileDetails(
			req.params.id
		);
		res.json(formatResponse(studentProfile));
	} catch (err) {
		formatError(err);
	}
});

export default router;

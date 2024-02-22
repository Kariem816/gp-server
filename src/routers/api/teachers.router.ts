import { Router } from "express";
import {
	getCourseProfile,
	mustBeTeacher,
	parseFilters,
	validateQuery,
} from "@/middlewares";
import { querySchema } from "@/schemas/query.schema";
import teacherStore from "@/models/teachers.model";
import { formatError } from "@/helpers";

const router = Router();

router.get("/mycourses", mustBeTeacher, getCourseProfile, async (req, res) => {
	try {
		const teacherId = res.locals.teacher.id;

		const courses = await teacherStore.getTeacherCourses(teacherId);
		res.json(courses);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/mylectures", mustBeTeacher, getCourseProfile, async (req, res) => {
	try {
		const teacherId = res.locals.teacher.id;

		const lectures = await teacherStore.getTeacherLectures(teacherId);
		res.json(lectures);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id/courses", async (req, res) => {
	try {
		const courses = await teacherStore.getTeacherCourses(req.params.id);
		res.json(courses);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/", validateQuery(querySchema), parseFilters, async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 50;
		const filters = res.locals.filters;

		const teachers = await teacherStore.index({
			page,
			limit,
			filters,
		});

		res.json(teachers);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const teacher = await teacherStore.show(req.params.id);
		res.json(teacher);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

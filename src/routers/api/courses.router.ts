import { Router } from "express";
import courseStore from "@/models/courses.model";
import {
	mustBeAdmin,
	mustBeAdminOrTeacher,
	mustBeCourseTeacher,
	parseFilters,
	validateBody,
	validateQuery,
} from "@/middlewares";
import { formatError } from "@/helpers";
import { querySchema } from "@/schemas/query.schema";
import {
	addTeachersSchema,
	createCourseSchema,
	editTeachersSchema,
	updateCourseSchema,
} from "@/schemas/courses.schema";
import { createLectureSchema } from "@/schemas/lectures.schema";

const router = Router();

router.get("/", validateQuery(querySchema), parseFilters, async (req, res) => {
	try {
		const limit = Number(req.query.limit) || 50;
		const page = Number(req.query.page) || 1;

		const courses = await courseStore.index({
			limit,
			page,
			filters: res.locals.filters,
		});

		res.json(courses);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const course = await courseStore.show(req.params.id);
		res.json(course);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/",
	mustBeAdmin,
	validateBody(createCourseSchema),
	async (req, res) => {
		try {
			const course = await courseStore.create(req.body);

			res.json(course);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.put(
	"/:id",
	mustBeAdmin,
	validateBody(updateCourseSchema),
	async (req, res) => {
		try {
			// TODO: Validate request
			const course = await courseStore.update(req.params.id, req.body);

			res.json(course);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id", mustBeAdmin, async (req, res) => {
	try {
		const course = await courseStore.delete(req.params.id);

		res.json(course);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/:id/teachers",
	mustBeAdmin,
	validateBody(addTeachersSchema),
	async (req, res) => {
		try {
			const course = await courseStore.addTeacher(
				req.params.id,
				req.body.teacherId
			);

			res.json(course);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id/teachers/:teacherId", mustBeAdmin, async (req, res) => {
	try {
		if (
			!(await courseStore.isTeacher(req.params.id, req.params.teacherId))
		) {
			res.status(400).json({
				error: "Bad Request",
				message: "This teacher is not assigned to this course",
			});
			return;
		}

		const course = await courseStore.removeTeacher(
			req.params.id,
			req.params.teacherId
		);

		res.json(course);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put(
	"/:id/teachers",
	mustBeAdmin,
	validateBody(editTeachersSchema),
	async (req, res) => {
		try {
			const addedTeachers = req.body.addedTeachers;
			const removedTeachers = req.body.removedTeachers;
			const course = await courseStore.updateTeachers(
				req.params.id,
				addedTeachers,
				removedTeachers
			);
			res.json(course);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/:id/teachers", async (req, res) => {
	try {
		const teachers = await courseStore.getTeachers(req.params.id);

		res.json(teachers);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get(
	"/:id/students",
	mustBeAdminOrTeacher,
	validateQuery(querySchema),
	async (req, res) => {
		try {
			const limit = Number(req.query.limit) || 50;
			const page = Number(req.query.page) || 1;
			const filters = res.locals.filters;

			const students = await courseStore.getStudents(req.params.id, {
				limit,
				page,
				filters,
			});

			res.json(students);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/:id/mystatus", async (req, res) => {
	if (!res.locals.student) {
		res.status(401).json({
			error: "Unauthorized",
			message:
				"You must be logged in as a student to register for a course",
		});
		return;
	}
	try {
		const status = await courseStore.isStudent(
			req.params.id,
			res.locals.student.id
		);
		res.json({ status });
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/:id/register", async (req, res) => {
	if (!res.locals.student) {
		res.status(401).json({
			error: "Unauthorized",
			message:
				"You must be logged in as a student to register for a course",
		});
		return;
	}
	try {
		if (await courseStore.isStudent(req.params.id, res.locals.student.id)) {
			res.status(400).json({
				error: "Bad Request",
				message: "You are already registered for this course",
			});
			return;
		}

		const course = await courseStore.addStudent(
			req.params.id,
			res.locals.student.id
		);
		res.json(course);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/:id/unregister", async (req, res) => {
	if (!res.locals.student) {
		res.status(401).json({
			error: "Unauthorized",
			message:
				"You must be logged in as a student to unregister from a course",
		});
		return;
	}
	try {
		if (
			!(await courseStore.isStudent(req.params.id, res.locals.student.id))
		) {
			res.status(400).json({
				error: "Bad Request",
				message: "You are not registered for this course",
			});
			return;
		}
		const course = await courseStore.removeStudent(
			req.params.id,
			res.locals.student.id
		);
		res.json(course);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get(
	"/:id/lectures",
	validateQuery(querySchema),
	parseFilters,
	async (req, res) => {
		try {
			const count = Number(req.query.count) || 50;
			const page = Number(req.query.page) || 1;

			const lectures = await courseStore.getLectures(req.params.id, {
				limit: count,
				page,
				filters: res.locals.filters,
			});

			res.json(lectures);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post(
	"/:id/lectures",
	mustBeCourseTeacher,
	validateBody(createLectureSchema),
	async (req, res) => {
		try {
			const { time } = req.body;
			const courseId = req.params.id;
			const lecture = await courseStore.addLecture(courseId, time);
			res.json({ lectures: lecture });
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

export default router;

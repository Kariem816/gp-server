import { Router } from "express";
import courseStore from "@/models/courses.model";
import {
	mustBe,
	mustBeCourseTeacher,
	parseFilters,
	validateBody,
	validateQuery,
} from "@/middlewares";
import { formatError, formatResponse } from "@/helpers";
import { querySchema } from "@/schemas/query.schema";
import {
	addTeachersSchema,
	createCourseSchema,
	editTeachersSchema,
	updateCourseSchema,
} from "@/schemas/courses.schema";
import { createLectureSchema } from "@/schemas/lectures.schema";

import type { z } from "zod";

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

		res.json(formatResponse(courses));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const course = await courseStore.show(req.params.id);
		res.json(formatResponse(course));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/",
	mustBe("admin"),
	validateBody(createCourseSchema),
	async (req, res) => {
		try {
			const course = await courseStore.create(req.body);

			res.json(formatResponse(course));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.put(
	"/:id",
	mustBe("admin"),
	validateBody(updateCourseSchema),
	async (req, res) => {
		try {
			const course = await courseStore.update(req.params.id, req.body);

			res.json(formatResponse(course));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id", mustBe("admin"), async (req, res) => {
	try {
		const course = await courseStore.delete(req.params.id);

		res.json(formatResponse(course));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/:id/teachers",
	mustBe("admin"),
	validateBody(addTeachersSchema),
	async (req, res) => {
		try {
			const course = await courseStore.addTeacher(
				req.params.id,
				req.body.teacherId
			);

			res.json(formatResponse(course));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id/teachers/:teacherId", mustBe("admin"), async (req, res) => {
	try {
		if (
			!(await courseStore.isTeacher(req.params.id, req.params.teacherId))
		) {
			return res.status(400).json({
				error: "BAD REQUEST",
				message: "This teacher is not assigned to this course",
			});
		}

		await courseStore.removeTeacher(req.params.id, req.params.teacherId);

		res.sendStatus(204);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put(
	"/:id/teachers",
	mustBe("admin"),
	validateBody(editTeachersSchema),
	async (req, res) => {
		try {
			const addedTeachers = req.body.addedTeachers;
			const removedTeachers = req.body.removedTeachers;
			await courseStore.updateTeachers(
				req.params.id,
				addedTeachers,
				removedTeachers
			);

			res.sendStatus(204);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/:id/teachers", async (req, res) => {
	try {
		const teachers = await courseStore.getTeachers(req.params.id);

		res.json(formatResponse(teachers));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get(
	"/:id/students",
	mustBe(["admin", "teacher"]),
	validateQuery(querySchema),
	async (req, res) => {
		try {
			const limit = Number(req.query.limit) || 50;
			const page = Number(req.query.page) || 1;
			const search = req.query.search as string;

			const students = await courseStore.getStudents(req.params.id, {
				limit,
				page,
				search,
			});

			res.json(formatResponse(students));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/:id/mystatus", async (req, res) => {
	if (!res.locals.student) {
		return res.status(401).json({
			error: "Unauthorized",
			message:
				"You must be logged in as a student to register for a course",
		});
	}
	try {
		const status = await courseStore.isStudent(
			req.params.id,
			res.locals.student.id
		);
		res.json(formatResponse({ status }));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/:id/register", async (req, res) => {
	if (!res.locals.student) {
		return res.status(401).json({
			error: "Unauthorized",
			message:
				"You must be logged in as a student to register for a course",
		});
	}
	try {
		if (await courseStore.isStudent(req.params.id, res.locals.student.id)) {
			return res.status(400).json({
				error: "Bad Request",
				message: "You are already registered for this course",
			});
		}

		await courseStore.addStudent(req.params.id, res.locals.student.id);

		res.sendStatus(204);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/:id/unregister", async (req, res) => {
	if (!res.locals.student) {
		return res.status(401).json({
			error: "Unauthorized",
			message:
				"You must be logged in as a student to unregister from a course",
		});
	}
	try {
		if (
			!(await courseStore.isStudent(req.params.id, res.locals.student.id))
		) {
			return res.status(400).json({
				error: "Bad Request",
				message: "You are not registered for this course",
			});
		}
		await courseStore.removeStudent(req.params.id, res.locals.student.id);

		res.sendStatus(204);
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
			const limit = Number(req.query.limit) || 50;
			const page = Number(req.query.page) || 1;

			const lectures = await courseStore.getLectures(req.params.id, {
				limit,
				page,
				filters: res.locals.filters,
			});

			res.json(formatResponse(lectures));
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
			const courseId = req.params.id;
			await courseStore.addLecture(
				courseId,
				req.body as z.infer<typeof createLectureSchema>
			);
			res.sendStatus(201);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

export default router;

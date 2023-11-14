import { Router } from "express";
import courseStore from "@/models/courses.model";
import { mustBeAdmin, parseFilters } from "@/middlewares";
import { routerError } from "@/helpers";

const router = Router();

router.get("/", parseFilters, async (req, res) => {
	try {
		const count = Number(req.query.count) || 50;
		const page = Number(req.query.page) || 1;

		const courses = await courseStore.index({
			limit: count,
			page,
			filters: res.locals.filters,
		});

		res.json(courses);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const isAllowed =
			res.locals.user.role === "student"
				? await courseStore.isStudent(req.params.id, res.locals.user.id)
				: true;

		const course = await courseStore.show(req.params.id, isAllowed);

		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.post("/", mustBeAdmin, async (req, res) => {
	try {
		// TODO: Validate request
		const course = await courseStore.create(req.body);

		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.put("/:id", mustBeAdmin, async (req, res) => {
	try {
		// TODO: Validate request
		const course = await courseStore.update(req.params.id, req.body);

		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.delete("/:id", mustBeAdmin, async (req, res) => {
	try {
		const course = await courseStore.delete(req.params.id);

		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.post("/:id/teachers", mustBeAdmin, async (req, res) => {
	try {
		// TODO: Validate request
		const course = await courseStore.addTeacher(
			req.params.id,
			req.body.teacherId
		);

		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.delete("/:id/teachers/:teacherId", mustBeAdmin, async (req, res) => {
	try {
		// TODO: Validate request
		const course = await courseStore.removeTeacher(
			req.params.id,
			req.params.teacherId
		);

		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.put("/:id/teachers", mustBeAdmin, async (req, res) => {
	try {
		// TODO: Validate request
		const addedTeachers = req.body.addedTeachers;
		const removedTeachers = req.body.removedTeachers;
		const course = await courseStore.updateTeachers(
			req.params.id,
			addedTeachers,
			removedTeachers
		);
		res.json(course);
	} catch (err: any) {
		routerError(err, res);
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
		const course = await courseStore.addStudent(
			req.params.id,
			res.locals.student.id
		);
		res.json(course);
	} catch (err: any) {
		routerError(err, res);
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
		// TODO: Validate request
		const course = await courseStore.removeStudent(
			req.params.id,
			res.locals.student.id
		);
		res.json(course);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.get("/:id/lectures", parseFilters, async (req, res) => {
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
		routerError(err, res);
	}
});

export default router;

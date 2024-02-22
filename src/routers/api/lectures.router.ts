import { Router } from "express";
import lectureStore from "@/models/lectures.model";
import {
	canModifyLecture,
	parseFilters,
	validateBody,
	validateQuery,
} from "@/middlewares";
import { formatError } from "@/helpers";
import {
	addLectureAttendeesSchema,
	removeLectureAttendeesSchema,
} from "@/schemas/lectures.schema";
import { updateCourseSchema } from "@/schemas/courses.schema";
import { querySchema } from "@/schemas/query.schema";

const router = Router();

router.put(
	"/:id",
	canModifyLecture,
	validateBody(updateCourseSchema),
	async (req, res) => {
		try {
			const lecture = await lectureStore.updateLecture(
				req.params.id,
				req.body
			);
			res.json(lecture);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id", canModifyLecture, async (req, res) => {
	try {
		await lectureStore.deleteLecture(req.params.id);
		res.sendStatus(204);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get(
	"/:id",
	canModifyLecture,
	validateQuery(querySchema),
	parseFilters,
	async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 50;
			const filters = res.locals.filters;

			const lecture = await lectureStore.getLecture(req.params.id, {
				page,
				limit,
				filters,
			});

			res.json(lecture);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/:id/attendees", canModifyLecture, async (req, res) => {
	try {
		const lecture = await lectureStore.getLectureAttendees(req.params.id);
		res.json(lecture);
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/:id/attendees",
	canModifyLecture,
	validateBody(addLectureAttendeesSchema),
	async (req, res) => {
		try {
			const lecture = await lectureStore.addLectureAttendees(
				req.params.id,
				req.body
			);
			res.json(lecture);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete(
	"/:id/attendees",
	canModifyLecture,
	validateBody(removeLectureAttendeesSchema),
	async (req, res) => {
		try {
			const lecture = await lectureStore.removeLectureAttendees(
				req.params.id,
				req.body
			);
			res.json(lecture);
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

export default router;

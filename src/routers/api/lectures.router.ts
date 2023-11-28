import { Router } from "express";
import lectureStore from "@/models/lectures.model";
import { parseFilters, validateBody, validateQuery } from "@/middlewares";
import { routerError } from "@/helpers";
import {
	addLectureAttendeesSchema,
	createLectureSchema,
	removeLectureAttendeesSchema,
} from "@/schemas/lectures.schema";
import { updateCourseSchema } from "@/schemas/courses.schema";
import { querySchema } from "@/schemas/query.schema";

const router = Router();

router.post("/", validateBody(createLectureSchema), async (req, res) => {
	try {
		const { time } = req.body;
		const { courseId } = res.locals;
		const lecture = await lectureStore.addLecture(courseId, new Date(time));
		res.json({ lectures: lecture });
	} catch (err: any) {
		routerError(err, res);
	}
});

router.put("/:id", validateBody(updateCourseSchema), async (req, res) => {
	try {
		const lecture = await lectureStore.updateLecture(
			req.params.id,
			req.body
		);
		res.json({ lecture });
	} catch (err: any) {
		routerError(err, res);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await lectureStore.deleteLecture(req.params.id);
		res.sendStatus(204);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.get(
	"/:id",
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

			res.json({ lecture });
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

router.post(
	"/:id/attendees",
	validateBody(addLectureAttendeesSchema),
	async (req, res) => {
		try {
			const lecture = await lectureStore.addLectureAttendees(
				req.params.id,
				req.body
			);
			res.json({ lecture });
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

router.delete(
	"/:id/attendees",
	validateBody(removeLectureAttendeesSchema),
	async (req, res) => {
		try {
			const lecture = await lectureStore.removeLectureAttendees(
				req.params.id,
				req.body
			);
			res.json({ lecture });
		} catch (err: any) {
			routerError(err, res);
		}
	}
);

export default router;

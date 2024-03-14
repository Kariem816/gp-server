import fs from "fs/promises";
import { Router } from "express";
import { RTSP } from "@/helpers";
import lectureStore from "@/models/lectures.model";
import controllerStore from "@/models/controllers.model";
import uploadStore from "@/models/uploads.model";
import { utapi } from "@/config/ut";
import {
	canModifyLecture,
	mustBe,
	parseFilters,
	validateBody,
	validateQuery,
} from "@/middlewares";
import { formatError, formatResponse } from "@/helpers";
import {
	addLectureAttendeesSchema,
	removeLectureAttendeesSchema,
	updateLectureSchema,
} from "@/schemas/lectures.schema";
import { querySchema } from "@/schemas/query.schema";
import { env } from "@/config/env";
import path from "path";
import * as re from "@/controllers/recognize.controller";
import { z } from "zod";

const router = Router();

router.post("/collect", mustBe(["admin", "controller"]), async (req, res) => {
	try {
		if (res.locals.user.role === "controller") {
			const controller = await controllerStore.getControllerByUserId(
				res.locals.user.id
			);
			if (!controller.controls.includes("attendance")) {
				return res.status(403).json({
					error: "FORBIDDEN",
					message: "You do not have the required permissions",
				});
			}
		}

		const lectures = await lectureStore.getActiveLectures();
		if (lectures.length === 0) {
			return res.sendStatus(204);
		}

		const promises: Promise<void>[] = []; // Array of promises to wait for
		const errors: string[] = []; // Array of errors to return

		async function getAttendanceForLecture(
			lecture: Awaited<(typeof lectures)[number]>
		) {
			let imgPath = "";
			let uploadedKey = "";
			let saved = false;
			try {
				// Get lecture data
				const { location, id } = lecture;

				const camera =
					await controllerStore.getCamerasByLocation(location);
				if (camera.length === 0) {
					errors.push(
						`No camera found for location ${location} for lecture ${id}`
					);
					return;
				}

				// Initiate RTSP stream
				const cam = new RTSP(
					`rtsp://${env.CAMERA_USERNAME}:${env.CAMERA_PASSWORD}@${camera[0].ip}/cam/realmonitor?channel=1&subtype=0`,
					camera[0].tcp,
					id
				);

				// Capture image
				imgPath = await cam.capture();

				// Upload image to UT
				const metadata = { lectureId: id, location, time: Date.now() };
				const uploadResponse = await utapi.uploadFiles(
					new File(
						[await fs.readFile(imgPath)],
						path.basename(imgPath)
					),
					{ metadata }
				);

				// handle upload error
				if (uploadResponse.error) {
					errors.push(`Failed to upload image for lecture ${id}`);
					return;
				}

				// process uploaded image
				const uploadedImg = uploadResponse.data;
				uploadedKey = uploadedImg.key;

				// Save uploaded image to database
				const { id: imgId } = await lectureStore.addAttendanceImage(
					id,
					uploadedImg.url
				);
				await uploadStore.create({
					...uploadedImg,
					metadata: {
						lectureId: lecture.id,
						time: Date.now(),
					},
				});
				saved = true;

				// Get students to be recognized
				const studentsData =
					await lectureStore.getPossibleAttendees(id);

				if (studentsData.length === 0) {
					errors.push("No students found for lecture " + lecture.id);
					return;
				}

				const attendance = await re.recognizeAttendance(
					uploadedImg.url,
					studentsData
				);

				if (attendance.length === 0) {
					errors.push(
						"No attendance data collected for lecture " + lecture.id
					);
					return;
				}

				// Add attendance to lecture
				await Promise.all([
					lectureStore.addLectureAttendees(
						id,
						attendance,
						new Date()
					),
					lectureStore.updateLectureImg(imgId, attendance.length),
				]);
			} catch (err) {
				console.error(err);
				errors.push(
					"Failed to collect attendance for lecture " + lecture.id
				);
				if (uploadedKey) {
					utapi.deleteFiles([uploadedKey]);
					if (saved) {
						uploadStore.delete(uploadedKey);
					}
				}
			} finally {
				// Clean up
				if (imgPath) {
					fs.unlink(imgPath);
				}
			}
		}

		for (const lecture of lectures) {
			promises.push(getAttendanceForLecture(lecture));
		}

		await Promise.all(promises);

		res.json(formatResponse({ errors }));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put(
	"/:id",
	canModifyLecture,
	validateBody(updateLectureSchema),
	async (req, res) => {
		try {
			const existingLecture = await lectureStore.getLecture(
				req.params.id
			);

			if (existingLecture.ended) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: "Lecture has already ended",
				});
			}

			const { time, duration, location } = req.body as z.infer<
				typeof updateLectureSchema
			>;

			const lecture = await lectureStore.updateLecture(req.params.id, {
				time,
				duration,
				location,
			});
			res.json(formatResponse(lecture));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id", canModifyLecture, async (req, res) => {
	try {
		const existingLecture = await lectureStore.getLecture(req.params.id);

		const lectureImgs = await lectureStore.getAttendanceImages(
			existingLecture.id,
			{ page: 1, limit: 1000 }
		);

		if (lectureImgs.data.length > 0) {
			const urls = lectureImgs.data.map((img) => img.img);
			const keys = (await uploadStore.showManyByURL(urls)).map(
				(u) => u.key
			);
			await utapi.deleteFiles(keys);
		}

		await lectureStore.deleteLecture(existingLecture.id);

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
			const lecture = await lectureStore.getLecture(req.params.id);

			res.json(formatResponse(lecture));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get(
	"/:id/attendees",
	canModifyLecture,
	validateQuery(querySchema),
	parseFilters,
	async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 50;
			const filters = res.locals.filters;

			const lecture = await lectureStore.getLectureAttendees(
				req.params.id,
				{
					page,
					limit,
					filters,
				}
			);
			res.json(formatResponse(lecture));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get(
	"/:id/absentees",
	canModifyLecture,
	validateQuery(querySchema),
	parseFilters,
	async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 50;
			const filters = res.locals.filters;

			const lecture = await lectureStore.getLectureAbsentees(
				req.params.id,
				{
					page,
					limit,
					filters,
				}
			);
			res.json(formatResponse(lecture));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get(
	"/:id/imgs",
	canModifyLecture,
	validateQuery(querySchema),
	parseFilters,
	async (req, res) => {
		try {
			const page = Number(req.query.page) || 1;
			const limit = Number(req.query.limit) || 5;

			const imgs = await lectureStore.getAttendanceImages(req.params.id, {
				page,
				limit,
			});
			res.json(formatResponse(imgs));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post(
	"/:id/attendees",
	canModifyLecture,
	validateBody(addLectureAttendeesSchema),
	async (req, res) => {
		try {
			const existingLecture = await lectureStore.getLecture(
				req.params.id
			);

			if (existingLecture.time > new Date()) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: "Lecture has not started yet",
				});
			}

			let endTime = existingLecture.ended;
			if (!endTime) {
				endTime = new Date(
					existingLecture.time.getTime() +
						existingLecture.duration * 60000
				);
			}

			if (endTime < new Date()) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: "Lecture has already ended",
				});
			}

			const lecture = await lectureStore.addLectureAttendees(
				req.params.id,
				req.body
			);
			res.json(formatResponse(lecture));
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
			res.json(formatResponse(lecture));
		} catch (err: any) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post("/:id/finish", canModifyLecture, async (req, res) => {
	try {
		const existingLecture = await lectureStore.getLecture(req.params.id);
		if (!existingLecture) {
			return res.status(404).json({
				error: "NOT_FOUND",
				message: "Lecture not found",
			});
		}

		if (existingLecture.ended) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Lecture has already ended",
			});
		}

		if (existingLecture.time > new Date()) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Lecture has not started yet",
			});
		}

		const endTime = new Date();
		if (
			endTime.getTime() >
			existingLecture.time.getTime() + existingLecture.duration * 60000
		) {
			endTime.setTime(
				existingLecture.time.getTime() +
					existingLecture.duration * 60000
			);
		}

		const lecture = await lectureStore.finishLecture(
			req.params.id,
			endTime
		);
		res.json(formatResponse(lecture));
	} catch (err: any) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

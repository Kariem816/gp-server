import { ut, utapi } from "@/config/ut";
import userStore from "@/models/users.model";
import uploadStore from "@/models/uploads.model";
import sessionStore from "@/models/sessions.model";
import courseStore from "@/models/courses.model";
import teacherStore from "@/models/teachers.model";
import lectureStore from "@/models/lectures.model";

import * as re from "@/controllers/recognize.controller";
import { UploadThingError } from "uploadthing/server";
import { sendNotifications } from "@/helpers/notifications";
import { z } from "zod";

import { createRouteHandler, type FileRouter } from "uploadthing/express";

// Define endpoints for UploadThing
// "endpoint": ut({ options }).middleware(middleware).onUploadComplete(onUploadComplete)
const uploadRouter = {
	profilePics: ut({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(({ res }) => {
			if (!res.locals.user) {
				throw new UploadThingError(
					"You must be logged in to upload a profile picture"
				);
			}
			return { userId: res.locals.user.id };
		})
		.onUploadComplete(async ({ file, metadata }) => {
			// save upload data to database
			// update user profile pic
			// delete old profile pic
			try {
				await uploadStore.create({
					...file,
					metadata,
				});
				const oldImg = await userStore.updateProfilePic(
					metadata.userId,
					file.url
				);

				let oldImgKey: string | undefined;

				if (oldImg) {
					const isUploaded =
						await uploadStore.isUploadedByUrl(oldImg);
					oldImgKey = isUploaded
						? (await uploadStore.deleteByURL(oldImg))?.key
						: undefined;
				}

				if (oldImgKey && oldImgKey !== file.key) {
					await utapi.deleteFiles(oldImgKey);
				}

				const prevEncoding = await userStore.getImgEncoding(
					metadata.userId
				);
				try {
					const newEncoding = await re.encodeImage(
						file.url,
						prevEncoding
					);

					await userStore.updateImgEncoding(
						metadata.userId,
						newEncoding
					);
				} catch (err) {
					console.error(err);
				}

				const tokens = await sessionStore.getNotificationTokensByUser(
					metadata.userId
				);

				if (tokens.length > 0) {
					await sendNotifications(tokens, {
						title: "Profile picture updated",
						body: "Your profile picture has been updated",
					});
				}
				return;
			} catch (err) {
				throw {
					error: "INTERNAL_SERVER_ERROR",
					message: "An error occurred while updating profile picture",
				};
			}
		}),
	attendance: ut({
		image: {
			maxFileSize: "32MB",
			maxFileCount: 1,
		},
	})
		.input(z.object({ lectureId: z.string() }))
		.middleware(async ({ res, input }) => {
			if (!res.locals.user) {
				throw new UploadThingError(
					"You must be logged in to upload attendance"
				);
			}

			if (res.locals.user.role !== "teacher") {
				throw new UploadThingError(
					"Only teachers can upload attendance"
				);
			}

			const lectureCourseId = await lectureStore.getLectureCourseId(
				input.lectureId
			);
			const teacherId = await teacherStore.getTeacherIdByUserId(
				res.locals.user.id
			);

			if (!teacherId) {
				throw new UploadThingError("Something went wrong");
			}

			const isTeacher = await courseStore.isTeacher(
				lectureCourseId,
				teacherId
			);
			if (!isTeacher) {
				throw new UploadThingError(
					"You are not a teacher of this course"
				);
			}

			return {
				userId: res.locals.user.id,
				teacherId,
				lectureId: input.lectureId,
			};
		})
		.onUploadComplete(async ({ file, metadata }) => {
			let tokens: string[] = [];
			let imageSaved = false;
			try {
				// save upload data to database
				await uploadStore.create({
					...file,
					metadata,
				});
				imageSaved = true;

				// Get teacher notification tokens
				tokens = await sessionStore.getNotificationTokensByUser(
					metadata.userId
				);

				// Get possible attendees
				const students = await lectureStore.getPossibleAttendees(
					metadata.lectureId
				);

				// Send to recognition service
				const attendance = await re.recognizeAttendance(
					file.url,
					students
				);

				await lectureStore.addLectureAttendees(
					metadata.lectureId,
					attendance,
					new Date()
				);

				sendNotifications(tokens, {
					title: "Attendance uploaded",
					body:
						attendance.length +
						" students have been marked present",
				});

				return { attendance: attendance.length };
			} catch (err) {
				// Report error to console
				console.error(err);

				// Send error notification to teacher
				if (tokens.length > 0)
					await sendNotifications(tokens, {
						title: "Attendance upload failed",
						body: "An error occurred while processing attendance",
					});

				// Throw error to client
				throw new UploadThingError(
					"An error occurred while processing attendance"
				);
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const uploadController = createRouteHandler({
	router: uploadRouter,
});

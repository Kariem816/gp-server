import { createResolver, ut } from "@/config/ut";
import userStore from "@/models/users.model";
import uploadStore from "@/models/uploads.model";
import sessionStore from "@/models/sessions.model";
import courseStore from "@/models/courses.model";
import teacherStore from "@/models/teachers.model";
import lectureStore from "@/models/lectures.model";

import { UploadThingError } from "uploadthing/server";
import { sendNotifications } from "@/helpers/notifications";
import { z } from "zod";

import { createRouteHandler, type FileRouter } from "uploadthing/express";
import { encodeAndUpdate, recognize } from "./recognizer.controller";

// Define endpoints for UploadThing
// "endpoint": ut({ options }).middleware(middleware).onUploadComplete(onUploadComplete)
const uploadRouter = {
	profilePics: ut({
		image: {
			maxFileSize: "8MB",
			maxFileCount: 1,
		},
	})
		.middleware(({ res }) => {
			if (!res.locals.user) {
				throw new UploadThingError({
					message:
						"You must be logged in to upload a profile picture",
					code: "FORBIDDEN",
				});
			}
			return { userId: res.locals.user.id };
		})
		.onUploadComplete(
			createResolver(async ({ file, metadata }) => {
				try {
					await uploadStore.create({
						...file,
						metadata,
					});
					await userStore.updateProfilePic(metadata.userId, file.url);

					// don't await this, let it run in the background
					encodeAndUpdate(metadata.userId, file.url);

					const tokens =
						await sessionStore.getNotificationTokensByUser(
							metadata.userId
						);

					if (tokens.length > 0) {
						await sendNotifications(tokens, {
							title: "Profile picture updated",
							body: "Your profile picture has been updated",
						});
					}
				} catch (err) {
					console.error(err);
					throw new Error(
						"An error occurred while updating profile picture"
					);
				}
			})
		),
	attendance: ut({
		image: {
			maxFileSize: "32MB",
			maxFileCount: 1,
		},
	})
		.input(z.object({ lectureId: z.string() }))
		.middleware(async ({ res, input }) => {
			if (!res.locals.user) {
				throw new UploadThingError({
					message: "You must be logged in to upload attendance",
					// why tf don't they have `UNAUTHORIZED` error
					code: "FORBIDDEN",
				});
			}

			if (res.locals.user.role !== "teacher") {
				throw new UploadThingError({
					message: "Only teachers can upload attendance",
					code: "FORBIDDEN",
				});
			}

			const lecture = await lectureStore.getLecture(input.lectureId);

			if (!lecture) {
				throw new UploadThingError({
					message: "Lecture not found",
					code: "NOT_FOUND",
				});
			}

			if (lecture.time > new Date()) {
				throw new UploadThingError({
					message: "Lecture has not started yet",
					code: "BAD_REQUEST",
				});
			} else {
				const endTime =
					lecture.ended ??
					new Date(lecture.time.getTime() + lecture.duration * 60000);
				if (endTime < new Date()) {
					if (!lecture.ended) {
						await lectureStore.finishLecture(lecture.id, endTime);
					}
					throw new UploadThingError({
						message: "Lecture has ended",
						code: "BAD_REQUEST",
					});
				}
			}

			const teacherId = await teacherStore.getTeacherIdByUserId(
				res.locals.user.id
			);

			if (!teacherId) {
				throw new UploadThingError("Something went wrong");
			}

			const isTeacher = await courseStore.isTeacher(
				lecture.courseId,
				teacherId
			);
			if (!isTeacher) {
				throw new UploadThingError({
					message: "You are not a teacher of this course",
					code: "FORBIDDEN",
				});
			}

			return {
				userId: res.locals.user.id,
				teacherId,
				lectureId: input.lectureId,
			};
		})
		.onUploadComplete(
			createResolver(async ({ file, metadata }) => {
				try {
					// save upload data to database
					const { id: imgId } = await lectureStore.addAttendanceImage(
						metadata.lectureId,
						file.url
					);
					await uploadStore.create({
						...file,
						metadata: {
							lectureId: metadata.lectureId,
							time: Date.now(),
						},
					});

					// Get teacher notification tokens
					const tokens =
						await sessionStore.getNotificationTokensByUser(
							metadata.userId
						);

					// don't await this, let it run in the background
					recognize(metadata.lectureId, imgId, file.url, tokens);

					if (tokens.length > 0) {
						await sendNotifications(tokens, {
							title: "Attendance uploaded",
							body: "Your attendance has been uploaded and is being processed by the system",
						});
					}
				} catch (err) {
					// Throw error to client
					throw new Error(
						"An error occurred while uploading attendance"
					);
				}
			})
		),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const uploadController = createRouteHandler({
	router: uploadRouter,
});

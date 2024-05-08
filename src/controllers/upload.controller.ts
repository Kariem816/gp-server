import { createResolver, ut } from "@/config/ut";
import userStore from "@/models/users.model";
import uploadStore from "@/models/uploads.model";
import sessionStore from "@/models/sessions.model";
import courseStore from "@/models/courses.model";
import teacherStore from "@/models/teachers.model";
import lectureStore from "@/models/lectures.model";

import {
	encodeImage,
	recognizeAttendance,
} from "@/controllers/recognize.controller";
import { UploadThingError } from "uploadthing/server";
import { sendNotifications } from "@/helpers/notifications";
import { z } from "zod";

import { createRouteHandler, type FileRouter } from "uploadthing/express";

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
				// save upload data to database
				// update user profile pic
				// delete old profile pic
				try {
					await uploadStore.create({
						...file,
						metadata,
					});
					await userStore.updateProfilePic(metadata.userId, file.url);

					const prevEncoding = await userStore.getImgEncoding(
						metadata.userId
					);
					try {
						const newEncoding = await encodeImage(
							file.url,
							prevEncoding
						);

						await userStore.updateImgEncoding(
							metadata.userId,
							newEncoding
						);
					} catch (err) {
						// TODO: add to queue to retry
						console.error(err);
					}

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
				let tokens: string[] = [];
				let imageSaved = false;
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
					try {
						const attendance = await recognizeAttendance(
							file.url,
							students
						);

						await Promise.all([
							lectureStore.addLectureAttendees(
								metadata.lectureId,
								attendance.students,
								new Date()
							),
							lectureStore.updateLectureImg(
								imgId,
								attendance.students.length,
								attendance.faces
							),
						]);

						sendNotifications(tokens, {
							title: "Attendance uploaded",
							body:
								attendance.students.length +
								" students have been marked present",
						});

						return { attendance: attendance.students.length };
					} catch (err) {
						// TODO: add to queue to retry
						throw err;
					}
				} catch (err) {
					console.error(err);
					// Send error notification to teacher
					if (tokens.length > 0)
						await sendNotifications(tokens, {
							title: "Attendance upload failed",
							body: "An error occurred while processing attendance",
						});

					// Throw error to client
					throw new Error(
						"An error occurred while processing attendance"
					);
				}
			})
		),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const uploadController = createRouteHandler({
	router: uploadRouter,
});

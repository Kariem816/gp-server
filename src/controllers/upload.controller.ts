import { ut, utapi } from "@/config/ut";
import { env } from "@/config/env";
import userStore from "@/models/users.model";
import uploadStore from "@/models/uploads.model";
import sessionStore from "@/models/sessions.model";
import courseStore from "@/models/courses.model";
import teacherStore from "@/models/teachers.model";
import lectureStore from "@/models/lectures.model";
import recognizer from "@/config/recognizer";

import { sendNotifications } from "@/helpers/notifications";
import { z } from "zod";

import { createRouteHandler, type FileRouter } from "uploadthing/express";
import { UploadThingError } from "uploadthing/server";
import { formatResponse } from "@/helpers";

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
					oldImgKey =
						(await uploadStore.deleteByURL(oldImg))?.key ??
						undefined;
				}

				if (oldImgKey) {
					await utapi.deleteFiles(oldImgKey);
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

				return formatResponse({ img: file.url });
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

			// if (!recognizer.token) {
			// 	throw new UploadThingError(
			// 		"Recognition service is not available"
			// 	);
			// }

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

				// Send to recognition service
				// const response = await fetch(
				// 	env.RECOGNIZER_BASEURL +
				// 		"/detect?token=" +
				// 		recognizer.token,
				// 	{
				// 		method: "POST",
				// 		body: JSON.stringify({
				// 			image: file.url,
				// 			imgs: [
				// 				{
				// 					id: "123", // student id,
				// 					data: '{"hamada": "mido"}', // encoded data for student images,
				// 				},
				// 			],
				// 			detector: "DLIB",
				// 			recognizer: "DLIB",
				// 		}),
				// 	}
				// );

				// if (!response.ok) {
				// 	throw {
				// 		error: "INTERNAL_SERVER_ERROR",
				// 		message:
				// 			"An error occurred while processing attendance",
				// 	};
				// }
				// const attendance: string[] = await response.json();
				const attendance: string[] = [
					"student1",
					"student2",
					"student3",
				];

				// await lectureStore.addLectureAttendees(
				// 	metadata.lectureId,
				// 	attendance
				// );

				sendNotifications(tokens, {
					title: "Attendance uploaded",
					body:
						attendance.length +
						" students have been marked present",
				});

				return formatResponse({ attendance: attendance.length });
			} catch (err) {
				// Report error to console
				console.error(err);

				// Delete the file from the database and storage
				if (imageSaved) {
					await uploadStore.deleteByURL(file.url);
				}
				await utapi.deleteFiles(file.key);

				// Send error notification to teacher
				if (tokens.length > 0)
					await sendNotifications(tokens, {
						title: "Attendance upload failed",
						body: "An error occurred while processing attendance",
					});

				// Throw error to client
				throw {
					error: "INTERNAL_SERVER_ERROR",
					message: "An error occurred while processing attendance",
				};
			}
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const uploadController = createRouteHandler({
	router: uploadRouter,
});

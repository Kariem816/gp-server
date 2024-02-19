import { ut, utapi } from "@/config/uploads";
import { env } from "@/config/env";
import userStore from "@/models/users.model";
import uploadStore from "@/models/uploads.model";
import sessionStore from "@/models/sessions.model";
import courseStore from "@/models/courses.model";
import teacherStore from "@/models/teachers.model";
import lectureStore from "@/models/lectures.model";
import { recognizer } from "@/config/recognizer";

import { sendNotifications } from "@/helpers/notifications";
import { z } from "zod";

import {
	createUploadthingExpressHandler,
	type FileRouter,
} from "uploadthing/express";

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
				throw {
					error: "UNAUTHORIZED",
					message:
						"You must be logged in to upload a profile picture",
				};
			}
			return { userId: res.locals.user.id };
		})
		.onUploadComplete(async ({ file, metadata }) => {
			// save upload data to database
			// update user profile pic
			// delete old profile pic
			await uploadStore.create({
				...file,
				metadata,
			});
			const oldImg = await userStore.updateProfilePic(
				metadata.userId,
				file.url
			);

			try {
				let oldImgKey: string | undefined;

				if (oldImg) {
					oldImgKey =
						(await uploadStore.deleteByURL(oldImg))?.key ??
						undefined;
				}

				if (oldImgKey) {
					await utapi.deleteFiles(oldImgKey);
				}
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

			return { img: file.url };
		}),
	attendance: ut({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.input(z.object({ lectureId: z.string() }))
		.middleware(async ({ res, input }) => {
			if (!res.locals.user) {
				throw {
					error: "UNAUTHORIZED",
					message: "You must be logged in to upload attendance",
				};
			}

			if (res.locals.user.role !== "teacher") {
				throw {
					error: "UNAUTHORIZED",
					message: "Only teachers can upload attendance",
				};
			}

			if (!recognizer.token) {
				throw {
					error: "INTERNAL_SERVER_ERROR",
					message: "Recognition service is not available",
				};
			}

			const lectureCourseId = await lectureStore.getLectureCourseId(
				input.lectureId
			);
			const teacherId = await teacherStore.getTeacherIdByUserId(
				res.locals.user.id
			);

			if (!teacherId) {
				throw {
					error: "INTERNAL_SERVER_ERROR",
					message: "Something went wrong",
				};
			}

			const isTeacher = await courseStore.isTeacher(
				lectureCourseId,
				teacherId
			);
			if (!isTeacher) {
				throw {
					error: "UNAUTHORIZED",
					message: "You are not a teacher of this course",
				};
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
				// TODO: Implement recognition service
				const response = await fetch(
					env.RECOGNIZER_BASEURL +
						"/detect?token=" +
						recognizer.token,
					{
						method: "POST",
						body: JSON.stringify({
							image: file.url,
							imgs: [
								{
									id: "123", // student id,
									data: '{"hamada": "mido"}', // encoded data for student images,
								},
							],
							detector: "DLIB",
							recognizer: "DLIB",
						}),
					}
				);

				if (!response.ok) {
					throw {
						error: "INTERNAL_SERVER_ERROR",
						message:
							"An error occurred while processing attendance",
					};
				}
				const attendance: string[] = await response.json();

				await lectureStore.addLectureAttendees(
					metadata.lectureId,
					attendance
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

export const uploadController = createUploadthingExpressHandler({
	router: uploadRouter,
});

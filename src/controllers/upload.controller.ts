import { ut, utapi } from "@/config/uploads.js";
import userStore from "@/models/users.model.js";
import uploadStore from "@/models/uploads.model.js";
import sessionStore from "@/models/sessions.model.js";
import { sendNotifications } from "@/helpers/notifications";

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
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export const uploadController = createUploadthingExpressHandler({
	router: uploadRouter,
});

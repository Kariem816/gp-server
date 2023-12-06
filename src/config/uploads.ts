import { createUploadthing, type FileRouter } from "uploadthing/express";
import userStore from "@/models/users.model";
import uploadStore from "@/models/uploads.model";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();
export const utapi = new UTApi();

export const uploadRouter = {
	profilePics: f({
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

			return { img: file.url };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

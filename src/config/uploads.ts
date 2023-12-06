import { createUploadthing, type FileRouter } from "uploadthing/express";
import userStore from "@/models/users.model";

const f = createUploadthing();

export const uploadRouter = {
	profilePics: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1,
		},
	})
		.middleware(({ req, res }) => {
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
			await userStore.updateProfilePic(metadata.userId, file.url);
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

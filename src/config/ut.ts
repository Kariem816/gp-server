import { createUploadthing } from "uploadthing/express";
import { UTApi, UploadThingError } from "uploadthing/server";

import type { UploadedFileData } from "uploadthing/types";

export const ut = createUploadthing();
export const utapi = new UTApi();

type ResolverOptions = {
	metadata: any;
	file: UploadedFileData;
};

type ResolverFn = (opts: ResolverOptions) => Promise<any>;

export function createResolver(resolver: ResolverFn) {
	return async (opts: ResolverOptions) => {
		try {
			return await resolver(opts);
		} catch (error) {
			if (error instanceof UploadThingError) {
				return {
					error: {
						error: error.code,
						message: error.message,
					},
				};
			} else if (error instanceof Error) {
				return {
					error: {
						error: "INTERNAL_SERVER_ERROR",
						message: error.message,
					},
				};
			} else if (typeof error === "object") {
				return {
					error,
				};
			}
			return {
				error: {
					error: "INTERNAL_SERVER_ERROR",
					message: "An unknown error occurred",
				},
			};
		}
	};
}

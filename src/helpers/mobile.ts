import type { Upload, Prisma } from "@prisma/client";

export function uploadToVersion(
	upload: Partial<Upload>,
	fb: string = ""
): string {
	if (typeof upload.metadata === "object") {
		const md = upload.metadata as Prisma.JsonObject as { version: string };
		return md.version;
	}
	return fb;
}

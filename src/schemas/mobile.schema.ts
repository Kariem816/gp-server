import z from "zod";

const versionSchema = z
	.string({
		required_error: "Version is required",
	})
	.regex(/^\d+\.\d+\.\d+$/, "Invalid version number");

export const updateURLSchema = z
	.object({
		url: z
			.string({
				required_error: "URL is required",
			})
			.url("Invalid URL"),
		version: versionSchema,
	})
	.strict();

export const downloadAPKSchema = z
	.object({
		version: versionSchema.optional(),
	})
	.strict();

export const updateAPKSchema = z
	.object({
		version: versionSchema,
	})
	.strict();

import { z } from "zod";

export const updateReconizerTokenSchema = z.object({
	token: z.string(),
});

export const updateReconizerURLSchema = z.object({
	url: z.string(),
});

export const addCameraSchema = z.object({
	location: z.string().min(1, "location_empty"),
	ip: z.string().min(1, "ip_empty"),
	tcp: z.boolean().optional(),
});

export const updateCameraSchema = z.object({
	location: z.string().optional(),
	ip: z.string().optional(),
	tcp: z.boolean().optional(),
});

export const newApiKeySchema = z.object({
	name: z.string().min(3).max(20),
	expiresAt: z
		.string()
		.datetime()
		.optional()
		.refine(
			(data) => {
				if (data && new Date(data) < new Date()) {
					return false;
				}
				return true;
			},
			{ message: "expiration time must be in the future" }
		),
});

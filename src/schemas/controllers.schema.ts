import { z } from "zod";

export const updateReconizerTokenSchema = z.object({
	token: z.string(),
});

export const updateReconizerURLSchema = z.object({
	url: z.string(),
});

export const addCameraSchema = z.object({
	location: z.string(),
	ip: z.string(),
});

export const newApiKeySchema = z.object({
	name: z.string(),
	expiresAt: z.string().datetime().optional(),
});

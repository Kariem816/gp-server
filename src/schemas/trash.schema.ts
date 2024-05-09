import { z } from "zod";

export const createTrashSchema = z.object({
	level: z.number().optional(),
	location: z.string(),
});

export const editTrashSchema = z.object({
	location: z.string().optional(),
});

export const editTrashBulkSchema = z
	.array(
		z.object({
			id: z.string(),
			location: z.string().optional(),
		})
	)
	.nonempty();

export const updateTrashLevelSchema = z.object({
	level: z.number(),
});

export const updateTrashLevelBulkSchema = z
	.array(z.object({ id: z.string(), level: z.number() }))
	.nonempty();

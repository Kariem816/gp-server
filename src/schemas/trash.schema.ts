import { z } from "zod";

export const createTrashSchema = z.object({
	level: z.number().optional(),
	location: z.string(),
});

export const editTrashSchema = z
	.object({
		level: z.number().optional(),
		location: z.string().optional(),
	})
	.refine(
		(data) => data.level || data.location,
		"At least one field is required to update trash can"
	);

export const editTrashBulkSchema = z
	.array(
		z.object({
			id: z.string(),
			level: z.number().optional(),
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

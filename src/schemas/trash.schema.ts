import { z } from "zod";

export const createTrashSchema = z
	.object({
		location: z.string(),
	})
	.strict();

export const editTrashBulkSchema = z
	.array(
		z
			.object({
				id: z.string(),
				location: z.string().optional(),
			})
			.strict()
	)
	.nonempty();

export const updateTrashLevelBulkSchema = z
	.array(
		z.object({ id: z.string(), level: z.number().min(0).max(100) }).strict()
	)
	.nonempty();

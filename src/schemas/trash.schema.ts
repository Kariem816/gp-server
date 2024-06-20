import { z } from "zod";

export const createTrashSchema = z
	.object({
		level: z.number().optional(),
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
	.array(z.object({ id: z.string(), level: z.number() }).strict())
	.nonempty();

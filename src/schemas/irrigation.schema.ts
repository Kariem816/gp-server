import { z } from "zod";

export const createPlantSchema = z
	.object({
		type: z.string(),
	})
	.strict();

export const checkManyPlantsSchema = z
	.array(
		z
			.object({
				id: z.string(),
				moisture: z.number().int().min(0).max(100),
				temperature: z.number().int(),
			})
			.strict()
	)
	.nonempty();

export const updateManyPlantsSchema = z.array(
	z
		.object({
			id: z.string(),
			isWatering: z.boolean(),
		})
		.strict()
);

import { z } from "zod";

export const createPlantSchema = z.object({
	type: z.string(),
});

export const checkManyPlantsSchema = z
	.array(
		z.object({
			id: z.string(),
			moisture: z.number().int().min(0).max(100),
		})
	)
	.nonempty();

export const updatePlantSchema = z.object({
	isWatering: z.boolean(),
});

export const updateManyPlantsSchema = z.array(
	z.object({
		id: z.string(),
		isWatering: z.boolean(),
	})
);

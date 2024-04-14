import { z } from "zod";

export const createPlantSchema = z.object({
	type: z.string(),
});

export const updatePlantSchema = z.object({
	isWatering: z.boolean(),
});

export const updateManyPlantsSchema = z.array(
	z.object({
		id: z.string(),
		isWatering: z.boolean(),
	})
);

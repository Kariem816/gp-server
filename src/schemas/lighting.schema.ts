import { z } from "zod";

export const createLightSchema = z.object({
	location: z.string(),
});

export const updateLightSchema = z.object({
	state: z.boolean(),
});

export const updateManyLightsSchema = z.array(
	z.object({
		id: z.string(),
		state: z.boolean(),
	})
);

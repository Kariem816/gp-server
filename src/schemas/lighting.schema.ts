import { z } from "zod";

export const createLightSchema = z.object({
	location: z.string(),
});

export const checkManyLightsSchema = z
	.array(z.object({ id: z.string(), body: z.boolean() }))
	.nonempty();

export const updateManyLightsSchema = z.array(
	z.object({
		id: z.string(),
		state: z.boolean(),
	})
);

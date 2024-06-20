import { z } from "zod";

export const createLightSchema = z
	.object({
		location: z.string(),
	})
	.strict();

export const checkManyLightsSchema = z
	.array(z.object({ id: z.string(), body: z.boolean() }).strict())
	.nonempty();

export const updateManyLightsSchema = z.array(
	z
		.object({
			id: z.string(),
			state: z.boolean(),
		})
		.strict()
);

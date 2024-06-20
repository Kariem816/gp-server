import { z } from "zod";

export const updateManySpotsSchema = z
	.array(
		z
			.object({
				id: z.string(),
				isEmpty: z.boolean(),
			})
			.strict()
	)
	.nonempty();

export const createParkingSpotSchema = z
	.object({
		location: z.string(),
	})
	.strict();

export const SmartParkingSpotSchema = z
	.object({
		location: z.string(),
		poly: z.array(z.tuple([z.number(), z.number()])),
	})
	.strict();

export const SmartSpotsUpdateSchema = z.array(SmartParkingSpotSchema);

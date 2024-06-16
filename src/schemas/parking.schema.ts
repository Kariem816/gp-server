import { z } from "zod";

export const updateManySpotsSchema = z
	.array(
		z.object({
			id: z.string(),
			isEmpty: z.boolean(),
		})
	)
	.nonempty();

export const createParkingSpotSchema = z.object({
	location: z.string(),
});

export const SmartParkingSpotSchema = z.object({
	location: z.string(),
	poly: z.array(z.tuple([z.number(), z.number()])),
});

export const SmartSpotsUpdateSchema = z.array(SmartParkingSpotSchema);

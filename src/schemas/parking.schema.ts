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

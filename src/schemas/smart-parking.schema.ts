import { z } from "zod";

export const SmartParkingSpotSchema = z.object({
	location: z.string(),
	poly: z.array(z.tuple([z.number(), z.number()])),
});

export const SmartSpotsUpdateSchema = z.array(SmartParkingSpotSchema);

import { z } from "zod";

export const recognitionResponseSchema = z
	.object({
		students: z.array(z.string()),
		faces: z.number(),
	})
	.strict();

export const encodeImageResponseSchema = z.string();

export const LPSchema = z.tuple([
	z.string().regex(/[٠-٩]{3,4}/),
	z.string().regex(/[أبجدرسصطعفقلمنهوى]{2,3}/),
]);

export const parkingStateSchema = z
	.object({
		id: z.string().uuid(),
		occupied: z.boolean(),
	})
	.strict();

export const bulkParkingStateSchema = z.array(parkingStateSchema);

import { z } from "zod";

export const recognitionResponseSchema = z.object({
	students: z.array(z.string()),
	faces: z.number(),
});

export const encodeImageResponseSchema = z.string();

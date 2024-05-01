import { z } from "zod";

export const recognitionResponseSchema = z.object({
	students: z.array(z.string()),
	faces: z.number(),
});

export const encodeImageResponseSchema = z.string();

// export const LPSchema = z.tuple([
// 	z.string().regex(/[٠-٩]{3,4}/),
// 	z.string().regex(/[أبجدرسصطعفقلمنهوى]{3,4}/),
// ]);

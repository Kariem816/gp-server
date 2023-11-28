import { z } from "zod";

export const createLectureSchema = z.object({
	time: z.coerce
		.date({
			required_error: "Time is required",
		})
		.min(new Date(), "Time must be in the future")
		.max(
			new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
			"Time must be within 90 days"
		),
});

export const updateLectureSchema = createLectureSchema;

export const addLectureAttendeesSchema = z.array(z.string().uuid());

export const removeLectureAttendeesSchema = addLectureAttendeesSchema;

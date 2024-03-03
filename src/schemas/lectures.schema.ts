import { z } from "zod";

export const lectureTimeSchema = z
	.number({
		required_error: "Time is required",
	})
	.min(Date.now(), "Time must be in the future")
	.max(
		new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).valueOf(),
		"Time must be within 90 days"
	);

export const createLectureSchema = z.object({
	time: lectureTimeSchema,
	duration: z.number().int().positive(),
	location: z.string().min(1, "Location is required"),
});

export const updateLectureSchema = z.object({
	time: lectureTimeSchema.optional(),
	duration: z.number().int().positive().optional(),
	location: z.string().optional(),
});

export const addLectureAttendeesSchema = z.array(z.string().uuid());

export const removeLectureAttendeesSchema = addLectureAttendeesSchema;

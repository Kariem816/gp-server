import { z } from "zod";

export const createCourseSchema = z.object({
	name: z.string().min(3).max(255),
	code: z.string().regex(/^[A-Z]{3}[0-9]{3}$/i),
	creditHours: z.number().int().min(0).max(6),
	content: z.string().optional(),
});

export const updateCourseSchema = z.object({
	name: z.string().min(3).max(255).optional(),
	code: z
		.string()
		.regex(/^[A-Z]{3}[0-9]{3}$/i)
		.optional(),
	creditHours: z.number().int().min(0).max(6).optional(),
	content: z.string().optional(),
});

export const courseTeacherSchema = z.union([
	z.string().uuid().array(),
	z.string().uuid(),
]);

export const addTeachersSchema = z.object({
	teacherId: courseTeacherSchema,
});

export const editTeachersSchema = z.object({
	addedTeachers: courseTeacherSchema,
	removedTeachers: courseTeacherSchema,
});

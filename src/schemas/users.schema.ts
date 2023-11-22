import { z } from "zod";
import { UserRole } from "@prisma/client";

export const usernameSchema = z
	.string({
		invalid_type_error: "Username must be a string",
		required_error: "Username is required",
	})
	.min(3)
	.max(10)
	.regex(/^[A-Za-z0-9_]+$/i);

export const imgSchema = z.string().url().optional();

export const nameSchema = z
	.string({
		invalid_type_error: "You must provide first and last name",
		required_error: "Name is required",
	})
	.min(5)
	.max(25)
	.regex(/^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+$/);

export const passwordSchema = z
	.string({
		required_error: "Password is required",
	})
	.min(8, "Password must be at least 8 characters long")
	.max(20, "Password must be at most 20 characters long")
	.refine((password) => {
		const hasNumber = /\d/;
		const hasUpper = /[A-Z]/;
		const hasLower = /[a-z]/;
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;

		return (
			hasNumber.test(password) &&
			hasUpper.test(password) &&
			hasLower.test(password) &&
			hasSpecial.test(password)
		);
	}, "Password must contain number, uppercase letter, lowercase letter and special character");

export const liscencePlateSchema = z
	.string()
	.min(6)
	.max(7)
	.regex(/^[0-9]{3,4}[\u0600-\u06ff]{2,3}$/)
	.optional();

export const newUserSchema = z.object({
	name: nameSchema,
	img: imgSchema,
	username: usernameSchema,
	password: passwordSchema,
	role: z.nativeEnum(UserRole),
	liscencePlate: liscencePlateSchema,
});

export const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export const updatePasswordSchema = z
	.object({
		oldPassword: passwordSchema,
		newPassword: passwordSchema,
	})
	.refine(
		(data) => data.oldPassword !== data.newPassword,
		"New password must be different from old password"
	);

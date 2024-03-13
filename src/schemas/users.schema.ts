import { ControlElement } from "@prisma/client";
import { Expo } from "expo-server-sdk";
import { z } from "zod";

export const usernameSchema = z
	.string({
		invalid_type_error: "Username must be a string",
		required_error: "Username is required",
	})
	.min(3, "Username must be at least 3 characters long")
	.max(10, "Username must be at most 10 characters long")
	.regex(
		/^[A-Za-z0-9_]+$/i,
		"Username can only contain letters, numbers and underscores"
	);

export const imgSchema = z.string().url().optional();

export const nameSchema = z
	.string({
		invalid_type_error: "You must provide first and last name",
		required_error: "Name is required",
	})
	.min(5, "Name must be at least 5 characters long")
	.max(25, "Name must be at most 25 characters long")
	.regex(
		/^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+$/,
		"Name must be in the format: First Last"
	);

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

export const licensePlateSchema = z
	.string()
	.min(6)
	.max(7)
	.regex(/^[1-9]{3,4}[أبجدرسصطعفقلمنهوى]{2,3}$/);

export const newUserSchema = z.object({
	name: nameSchema,
	img: imgSchema,
	username: usernameSchema,
	password: passwordSchema,
});

export const newControllerSchema = z.object({
	user: z.object({
		name: nameSchema,
		username: usernameSchema,
		password: passwordSchema,
	}),
	controller: z.object({
		location: z.string().optional(),
		controls: z
			.nativeEnum(ControlElement, {
				required_error: "Invalid Control Element",
			})
			.array()
			.nonempty("There must be at least one control element"),
	}),
});

export const loginSchema = z.object({
	username: z
		.string({ required_error: "Username is required" })
		.min(1, "Username is required"),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required"),
});

export const updatePasswordSchema = z
	.object({
		oldPassword: passwordSchema,
		newPassword: passwordSchema,
	})
	.refine((data) => {
		if (!data.oldPassword) return true;
		return data.oldPassword !== data.newPassword;
	}, "New password must be different from old password");

export const updatelicensePlateSchema = z.object({
	licensePlate: licensePlateSchema,
});

export const updateNotificationTokenSchema = z.object({
	token: z.string().refine((token) => {
		return Expo.isExpoPushToken(token);
	}, "Invalid notification token"),
});

export const notifyUserSchema = z.object({
	title: z.string(),
	body: z.string(),
});

export const notifyUsersSchema = z
	.object({
		title: z.string(),
		body: z.string(),
		userIds: z.array(z.string().uuid()).optional(),
		all: z.boolean().optional(),
	})
	.refine((data) => {
		return data.userIds?.length || data.all;
	}, "You must provide either userIds or all");

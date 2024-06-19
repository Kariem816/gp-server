import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { useSecurePage } from "~/hooks/use-secure-page";
import { capitalize } from "~/utils";

export const Route = createFileRoute("/register/")({
	component: RegisterPage,
});

const usernameSchema = z
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

const nameSchema = z
	.string({
		invalid_type_error: "You must provide first and last name",
		required_error: "Name is required",
	})
	.min(5, "Name must be at least 5 characters long")
	.max(25, "Name must be at most 25 characters long")
	.regex(/^[A-Za-z ]+$/, "Name can only contain english letters and spaces")
	.regex(
		/^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+$/,
		"Name must be in the format: First Last"
	);

const passwordSchema = z
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

const registerSchema = z
	.object({
		role: z.enum(["student", "teacher", "security"]),
		name: nameSchema,
		username: usernameSchema,
		password: passwordSchema,
		passwordRepeat: z.string(),
	})
	.refine((data) => data.password === data.passwordRepeat, {
		message: "Passwords do not match",
		path: ["passwordRepeat"],
	});

type TRegisterSchema = z.infer<typeof registerSchema>;

const roles = [
	{
		text: "student",
		Icon: ({ className }: { className?: string }) => (
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 448 512"
				height="1em"
				width="1em"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
			>
				<path d="M319.4 320.6L224 416l-95.4-95.4C57.1 323.7 0 382.2 0 454.4v9.6c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-9.6c0-72.2-57.1-130.7-128.6-133.8zM13.6 79.8l6.4 1.5v58.4c-7 4.2-12 11.5-12 20.3 0 8.4 4.6 15.4 11.1 19.7L3.5 242c-1.7 6.9 2.1 14 7.6 14h41.8c5.5 0 9.3-7.1 7.6-14l-15.6-62.3C51.4 175.4 56 168.4 56 160c0-8.8-5-16.1-12-20.3V87.1l66 15.9c-8.6 17.2-14 36.4-14 57 0 70.7 57.3 128 128 128s128-57.3 128-128c0-20.6-5.3-39.8-14-57l96.3-23.2c18.2-4.4 18.2-27.1 0-31.5l-190.4-46c-13-3.1-26.7-3.1-39.7 0L13.6 48.2c-18.1 4.4-18.1 27.2 0 31.6z"></path>
			</svg>
		),
	},
	{
		text: "teacher",
		Icon: ({ className }: { className?: string }) => (
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 640 512"
				height="1em"
				width="1em"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
			>
				<path d="M208 352c-2.39 0-4.78.35-7.06 1.09C187.98 357.3 174.35 360 160 360c-14.35 0-27.98-2.7-40.95-6.91-2.28-.74-4.66-1.09-7.05-1.09C49.94 352-.33 402.48 0 464.62.14 490.88 21.73 512 48 512h224c26.27 0 47.86-21.12 48-47.38.33-62.14-49.94-112.62-112-112.62zm-48-32c53.02 0 96-42.98 96-96s-42.98-96-96-96-96 42.98-96 96 42.98 96 96 96zM592 0H208c-26.47 0-48 22.25-48 49.59V96c23.42 0 45.1 6.78 64 17.8V64h352v288h-64v-64H384v64h-76.24c19.1 16.69 33.12 38.73 39.69 64H592c26.47 0 48-22.25 48-49.59V49.59C640 22.25 618.47 0 592 0z"></path>
			</svg>
		),
	},
	{
		text: "security",
		Icon: ({ className }: { className?: string }) => (
			<svg
				stroke="currentColor"
				fill="currentColor"
				stroke-width="0"
				viewBox="0 0 448 512"
				height="1em"
				width="1em"
				xmlns="http://www.w3.org/2000/svg"
				className={className}
			>
				<path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z"></path>
			</svg>
		),
	},
];

function RegisterPage() {
	const { register } = useAuth();
	const { t } = useTranslation();

	const form = useForm<TRegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			role: undefined,
			name: "",
			username: "",
			password: "",
			passwordRepeat: "",
		},
	});

	const navigate = useNavigate();

	useSecurePage("/", "guest");

	const registerMutation = useMutation({
		mutationFn: (input: TRegisterSchema) => {
			const { role, ...data } = input;
			return register(data, role);
		},
		onSuccess: () => {
			toast.success(t("register_success"));
			navigate({
				to: "/login",
			});
			form.reset();
		},
		onError: (err) => {
			if ("message" in err) {
				toast.error(err.message);
			} else if ("messages" in err) {
				// @ts-expect-error ts is dumb
				for (const message of err.messages) {
					form.setError(message.path, message.message);
				}
			}
		},
	});

	function handleSubmit(values: TRegisterSchema) {
		values.name = capitalize(values.name.trim());
		registerMutation.mutateAsync(values);
	}

	return (
		<div className=" container h-full flex flex-col justify-center items-center p-8">
			<Card className="max-w-2xl w-full flex-1 overflow-y-auto overflow-x-hidden shadow-lg">
				<CardHeader>
					<CardTitle className="text-center">
						{t("register_phrase")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="role"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("account_type")}
											</FormLabel>
											<FormControl>
												<div className="flex justify-center gap-4">
													{roles.map(
														({ text, Icon }) => (
															<Button
																key={text}
																type="button"
																onClick={() =>
																	field.onChange(
																		text
																	)
																}
																variant={
																	field.value ===
																	text
																		? "default"
																		: "outline"
																}
																className="border"
															>
																<Icon className="me-2" />
																{t(text)}
															</Button>
														)
													)}
												</div>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>{t("name")}</FormLabel>
											<FormControl>
												<Input
													placeholder={t("name")}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="username"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("username")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder={t("username")}
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("password")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder={t("password")}
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="passwordRepeat"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												{t("confirm_password")}
											</FormLabel>
											<FormControl>
												<Input
													placeholder={t("password")}
													type="password"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="text-center mt-4">
								<Button
									type="submit"
									disabled={registerMutation.isPending}
								>
									{registerMutation.isPending && (
										<UpdateIcon className="animate-spin me-2" />
									)}
									{t("register")}
								</Button>
							</div>
						</form>
					</Form>
					<CardFooter className="border-t mt-4">
						<div className="flex flex-col justify-center gap-2 w-full">
							<Button
								variant="success"
								size="lg"
								asChild
								className="text-center text-wrap min-h-10 h-auto"
							>
								<Link to="/login">{t("to_login_phrase")}</Link>
							</Button>
						</div>
					</CardFooter>
				</CardContent>
			</Card>
		</div>
	);
}

import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { useNavigate } from "@tanstack/react-router";
import { useSecurePage } from "~/hooks/use-secure-page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import type { SearchSchemaInput } from "@tanstack/react-router";
import { useTranslation } from "~/contexts/translation";
import { UpdateIcon } from "@radix-ui/react-icons";

export const Route = createFileRoute("/login/")({
	component: LoginPage,
	validateSearch: (
		search: {
			redirect?: string;
		} & SearchSchemaInput
	) => ({ redirect: search.redirect ?? "/" }),
});

const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});

function LoginPage() {
	const { redirect } = Route.useSearch();
	const { login } = useAuth();
	const { t } = useTranslation();

	const [isLoading, setIsLoading] = useState(false);
	const [formError, setFormError] = useState("");
	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const navigate = useNavigate();

	useSecurePage(redirect, "guest");

	async function handleSubmit(values: z.infer<typeof loginSchema>) {
		if (isLoading) return;
		try {
			setIsLoading(true);
			await login(values.username, values.password);
			form.reset();
			console.log(redirect);
			if (redirect.startsWith("http")) {
				navigate({
					to: "/",
				});
			} else {
				navigate({
					to: redirect as any,
				});
			}
		} catch (err: any) {
			if ("message" in err) setFormError(err.message);
			else if ("messages" in err)
				for (const message of err.messages) {
					form.setError(message.path, message.message);
				}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<div className="   container h-full flex flex-col justify-center items-center">
			<Card className="max-w-2xl w-full">
				<CardHeader>
					<CardTitle className="text-center">
						{t("login_phrase")}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<FormField
								control={form.control}
								name="username"
								render={() => (
									<FormItem>
										<FormLabel>{t("username")}</FormLabel>
										<FormControl>
											<Input
												placeholder={t("username")}
												{...form.register("username")}
											/>
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={() => (
									<FormItem>
										<FormLabel>{t("password")}</FormLabel>
										<FormControl>
											<Input
												placeholder={t("password")}
												type="password"
												{...form.register("password")}
											/>
										</FormControl>
										<FormDescription />
										<FormMessage />
									</FormItem>
								)}
							/>

							<p className="text-red-500 text-sm">{formError}</p>
							<div className="text-center mt-4">
								<Button type="submit" disabled={isLoading}>
									{isLoading && (
										<UpdateIcon className="animate-spin me-2" />
									)}
									{t("login")}
								</Button>
							</div>
						</form>
					</Form>
					<CardFooter className="border-t mt-4">
						<div className="flex flex-col justify-center gap-2 w-full">
							<Button variant="link" asChild>
								<Link to="/password-reset" replace>
									{t("forgot_password")}
								</Link>
							</Button>
							<Button
								variant="success"
								size="lg"
								asChild
								className="text-center text-wrap min-h-10 h-auto"
							>
								<Link to="/register">
									{t("to_register_phrase")}
								</Link>
							</Button>
						</div>
					</CardFooter>
				</CardContent>
			</Card>
		</div>
	);
}

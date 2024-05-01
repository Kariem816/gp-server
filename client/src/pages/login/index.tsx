import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { useNavigate } from "@tanstack/react-router";
import { useSecurePage } from "~/hooks/use-secure-page";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

export function LoginPage() {
	const { redirect } = Route.useSearch();
	const { login } = useAuth();

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
			navigate({
				to: redirect as any,
			});
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
					<CardTitle className="text-center">Welcome back!</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<FormField
								control={form.control}
								name="username"
								render={() => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input
												placeholder="Your username"
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
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												placeholder="Your password"
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
									Log in
								</Button>
							</div>
							<div>
  								
  								<hr className=" mt-4" style={{ width: '100%', borderTop: '1px solid #ddd' }} />
  								
							</div>

							<p className="text-center mt-4 text-blue-600 " >
								<a className="hover:underline"href="http://localhost:5173/password-reset" >
									Forgotten password?
								</a>
								
							</p>
							<div className="text-center	 mt-4 ">
								<Button className="bg-lime-700 hover:bg-lime-800">
								<a type="submit"  href="http://localhost:5173/register" >
									Create new account
								</a>
								</Button>
							
								
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}	

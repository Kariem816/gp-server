import { useState } from "react";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { useNavigate } from "@tanstack/react-router";
import { useSecurePage } from "~/hooks/useSecurePage";
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

export const Route = createFileRoute("/password-reset/")({
	component: PasswordReset,
});

const loginSchema = z.object({
	username: z.string().min(1),
	password: z.string().min(1),
});
export function PasswordReset() {
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
	const showPage = useSecurePage("guest");
	if (showPage === "deny") return <Navigate to="/" replace />;
    async function handleSubmit(values: z.infer<typeof loginSchema>) {
		if (isLoading) return;
		try {
			setIsLoading(true);
			await login(values.username, values.password);
			form.reset();
			navigate({
				to: "/",
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
		<div className="container h-full flex flex-col justify-center items-center">
			<Card className="max-w-2xl w-full">
				<CardHeader>
					<CardTitle className="text-center">Find Your Account</CardTitle>
					<hr className=" mt-4" style={{ width: '100%', borderTop: '1px solid #ddd' }} />
                    <div>Please enter your username to search for your account.</div>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)}>
							<FormField
								control={form.control}
								name="username"
								render={() => (
									<FormItem>
										<FormLabel>Username:</FormLabel>
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
							
							<p className="text-red-500 text-sm">{formError}</p>
							<div className="text-center mt-4">
								<Button type="submit" disabled={isLoading}>
									Search
								</Button>
							</div>
							<hr className=" mt-4" style={{ width: '100%', borderTop: '1px solid #ddd' }} />
                            <div className="text-center mt-4" > Or create a new account?</div>

							<div  className="text-center">
                            <Button  className="bg-lime-700 hover:bg-lime-600">
									<a href="/register"> Create new account</a>
							</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
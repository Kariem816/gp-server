import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
	TextInput,
	PasswordInput,
	Anchor,
	Paper,
	Title,
	Text,
	Container,
	Group,
	Button,
} from "@mantine/core";
import { useAuth } from "~/contexts/auth";
import { useNavigate } from "@tanstack/react-router";
import { useSecurePage } from "~/hooks/useSecurePage";
import { useForm } from "@mantine/form";

import classes from "~/styles/login.module.css";

export const Route = createFileRoute("/login/")({
	component: LoginPage,
});

export function LoginPage() {
	const { login } = useAuth();

	const [isLoading, setIsLoading] = useState(false);
	const [formError, setFormError] = useState("");
	const form = useForm({
		initialValues: {
			username: "",
			password: "",
		},
		validate: {
			username: (value) =>
				value.trim().length === 0 ? "Username is missing" : null,
			password: (value) =>
				value.trim().length === 0 ? "Password is missing" : null,
		},
	});

	const navigate = useNavigate();
	useSecurePage("guest", "/");

	async function handleSubmit(values: typeof form.values) {
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
					form.setFieldError(message.path, message.message);
				}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Container size={420} my={40}>
			<Title ta="center" className={classes.title}>
				Welcome back!
			</Title>
			<Text c="dimmed" size="sm" ta="center" mt={5}>
				Do not have an account yet?{" "}
				<Anchor size="sm" component="button">
					Create account
				</Anchor>
			</Text>

			<Paper withBorder shadow="md" p={30} mt={30} radius="md">
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<TextInput
						label="Username"
						name="username"
						placeholder="Your username"
						required
						{...form.getInputProps("username")}
					/>
					<PasswordInput
						label="Password"
						name="password"
						placeholder="Your password"
						required
						mt="md"
						{...form.getInputProps("password")}
					/>
					<Text c="red" mt="sm" fw="bold">
						{formError}
					</Text>
					<Group justify="flex-end" mt="lg">
						<Anchor component="button" size="sm">
							Forgot password?
						</Anchor>
					</Group>
					<Button fullWidth mt="xl" type="submit" loading={isLoading}>
						Sign in
					</Button>
				</form>
			</Paper>
		</Container>
	);
}

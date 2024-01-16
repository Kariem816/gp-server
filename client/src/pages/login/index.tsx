import { useState } from "react";
import { FileRoute } from "@tanstack/react-router";
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

import type { ChangeEvent, FormEvent } from "react";

import classes from "~/styles/login.module.css";
import { useSecurePage } from "~/hooks/useSecurePage";

export const Route = new FileRoute("/login/").createRoute({
	component: LoginPage,
});

export function LoginPage() {
	const { login } = useAuth();

	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const [formError, setFormError] = useState("");
	const [formErrors, setFormErrors] = useState({
		username: "",
		password: "",
	});

	const navigate = useNavigate();
	useSecurePage("guest", "/");

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;

		setFormData((prev) => ({ ...prev, [name]: value }));
		setFormErrors((prev) => ({ ...prev, [name]: "" }));
		setFormError("");
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const errors = {} as any;
		const { username, password } = formData;
		if (!username) errors.username = "username_missing";
		if (!password) errors.password = "password_missing";

		if (Object.keys(errors).length) {
			setFormError(errors);
			return;
		}
		setFormErrors({ username: "", password: "" });

		try {
			await login(username, password);
			navigate({
				to: "/",
			});
		} catch (err: any) {
			if ("message" in err) setFormError(err.message);
			else if ("messages" in err)
				setFormError(err.messages.map((msg: any) => msg.message));
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
				<form onSubmit={handleSubmit}>
					<TextInput
						label="Username"
						name="username"
						placeholder="Your username"
						required
						value={formData.username}
						error={formErrors.username}
						onChange={handleChange}
					/>
					<PasswordInput
						label="Password"
						name="password"
						placeholder="Your password"
						required
						mt="md"
						value={formData.password}
						error={formErrors.password}
						onChange={handleChange}
					/>
					<Text c="red" mt="sm" fw="bold">
						{formError}
					</Text>
					<Group justify="flex-end" mt="lg">
						<Anchor component="button" size="sm">
							Forgot password?
						</Anchor>
					</Group>
					<Button fullWidth mt="xl" type="submit">
						Sign in
					</Button>
				</form>
			</Paper>
		</Container>
	);
}

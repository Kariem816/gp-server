import { Link, NotFoundRoute } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Title, Text, Stack, Button } from "@mantine/core";

export const Route = new NotFoundRoute({
	component: NotFound,
	getParentRoute: () => routeTree,
});

export function NotFound() {
	return (
		<Stack align="center" py={150}>
			<Title order={1}>404</Title>
			<Title order={2}>Page not found</Title>
			<Text>The page you are looking for does not exist.</Text>
			<Button component={Link} to="/">
				Go home
			</Button>
		</Stack>
	);
}

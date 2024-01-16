import { Link, NotFoundRoute } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Title, Text, Stack, Button } from "@mantine/core";

export const Route = new NotFoundRoute({
	component: NotFound,
	getParentRoute: () => routeTree,
});

export function NotFound() {
	return (
		<Stack align="center" pt={150}>
			<Title order={1} ta="center">
				404
			</Title>
			<Title order={2} ta="center">
				Page not found
			</Title>
			<Text ta="center">
				The page you are looking for does not exist.
			</Text>
			<Button component={Link} to="/">
				Go home
			</Button>
		</Stack>
	);
}

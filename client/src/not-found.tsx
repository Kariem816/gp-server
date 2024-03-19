import { Link, NotFoundRoute } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Button } from "./components/ui/button";

export const Route = new NotFoundRoute({
	component: NotFound,
	getParentRoute: () => routeTree,
});

export function NotFound() {
	return (
		<div className="flex flex-col items-center">
			<h1 className="text-center">404</h1>
			<h2 className="text-center">Page not found</h2>
			<p className="text-center">
				The page you are looking for does not exist.
			</p>
			<Button size="lg">
				<Link to="/">Go home</Link>
			</Button>
		</div>
	);
}

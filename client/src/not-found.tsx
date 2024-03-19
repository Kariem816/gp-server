import { Link, NotFoundRoute } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Button } from "./components/ui/button";
import { HomeIcon } from "@radix-ui/react-icons";

export const Route = new NotFoundRoute({
	component: NotFound,
	getParentRoute: () => routeTree,
});

export function NotFound() {
	return (
		<div className="h-full flex flex-col items-center justify-center text-center">
			<h1>404</h1>
			<h2>Page not found</h2>
			<p>The page you are looking for does not exist.</p>
			<Button size="lg" asChild>
				<Link to="/" className="mt-4">
					<HomeIcon className="w-6 h-6 mr-2" />
					Go home
				</Link>
			</Button>
		</div>
	);
}

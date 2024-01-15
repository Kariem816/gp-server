import { Router } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { Route as NotFoundRoute } from "./not-found";

export function createRouter() {
	return new Router({
		routeTree,
		notFoundRoute: NotFoundRoute,
		context: {
			head: "",
		},
		defaultPreload: "intent",
	});
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

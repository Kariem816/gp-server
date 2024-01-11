import React from "react";
import { NotFoundRoute } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const Route = new NotFoundRoute({
	component: NotFound,
	getParentRoute: () => routeTree,
});

function NotFound() {
	return (
		<div className="section">
			<h1>404 | Not Found</h1>
		</div>
	);
}

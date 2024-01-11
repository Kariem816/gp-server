import React from "react"; // TODO: Find a way to remove this import (tsconfig.json)
import { Outlet, rootRouteWithContext } from "@tanstack/react-router";
import { RouterContext } from "../routerContext";

export const Route = rootRouteWithContext<RouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<Outlet />
		</>
	);
}

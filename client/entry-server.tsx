import React from "react";
import ReactDOMServer from "react-dom/server";
import { createRouter } from "./router";
import { createMemoryHistory } from "@tanstack/react-router";
import { StartServer } from "@tanstack/react-router-server/server";

export async function render(url: string, ssrManifest?: any) {
	const router = createRouter();

	const memoryHistory = createMemoryHistory({
		initialEntries: [url],
	});

	// Update the history and context
	router.update({
		history: memoryHistory,
		context: {
			...router.options.context,
			// head: opts.head,
		},
	});

	// Since we're using renderToString, Wait for the router to finish loading
	await router.load();

	const html = ReactDOMServer.renderToString(
		<React.StrictMode>
			<StartServer router={router} />
		</React.StrictMode>
	);

	return { html };
}

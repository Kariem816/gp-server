import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { TranslationProvider } from "./contexts/translation";
import { AuthProvider } from "~/contexts/auth";
import { routeTree } from "./routeTree.gen";

import "~/styles/global.css";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<TranslationProvider>
			<AuthProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</AuthProvider>
		</TranslationProvider>
	</React.StrictMode>
);

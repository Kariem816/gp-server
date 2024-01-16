import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";
import { MantineProvider } from "@mantine/core";
import AuthProvider from "~/contexts/auth";
import { theme } from "~/config/theme";

import "@mantine/core/styles.css";

const router = createRouter();

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<MantineProvider theme={theme}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</MantineProvider>
	</React.StrictMode>
);

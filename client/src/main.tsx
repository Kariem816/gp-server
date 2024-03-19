import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";
import AuthProvider from "~/contexts/auth";

import "~/styles/global.css";

const router = createRouter();

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
);

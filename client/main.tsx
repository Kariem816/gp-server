import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";

import "./index.css";

const router = createRouter();

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);

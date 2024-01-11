import React from "react";
import ReactDOM from "react-dom/client";
import { StartClient } from "@tanstack/react-router-server/client";
import { createRouter } from "./router";

import "./index.css";

const router = createRouter();
router.hydrate();

ReactDOM.hydrateRoot(
	document.getElementById("root") as HTMLElement,
	<React.StrictMode>
		<StartClient router={router} />
	</React.StrictMode>
);

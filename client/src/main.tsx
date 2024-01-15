import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";
import { RouterProvider } from "@tanstack/react-router";
import { createTheme, MantineProvider } from "@mantine/core";

import type { MantineColorsTuple } from "@mantine/core";

// import "./index.css";
import "@mantine/core/styles.css";

const router = createRouter();

const myColor: MantineColorsTuple = [
	"#e4f8ff",
	"#d2eafd",
	"#a6d2f3",
	"#78b8eb",
	"#52a3e4",
	"#3996e1",
	"#288fe0",
	"#177bc7",
	"#036eb4",
	"#005f9f",
];

const theme = createTheme({
	colors: {
		myColor,
	},
});

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

root.render(
	<React.StrictMode>
		<MantineProvider theme={theme}>
			<RouterProvider router={router} />
		</MantineProvider>
	</React.StrictMode>
);

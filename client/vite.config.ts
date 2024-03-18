import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import path from "path";

const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		TanStackRouterVite({
			routesDirectory: path.join(__dirname, "/src/pages"),
			generatedRouteTree: path.join(__dirname, "/src/routeTree.gen.ts"),
			quoteStyle: "double",
		}),
	],
	resolve: {
		alias: {
			"~": "/src",
		},
	},
	envDir: path.join(__dirname, ".."),
	build: {
		outDir: "../dist/client",
	},
});

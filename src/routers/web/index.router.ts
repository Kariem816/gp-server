import path from "path";
import { Router, static as static_ } from "express";
import { env } from "@/config/env";

// Constants
const isProduction = env.NODE_ENV === "production";

const router = Router();

// Add Vite or respective production middlewares
if (!isProduction) {
	import("vite").then(async ({ createServer }) => {
		const vite = await createServer({
			root: path.resolve(process.cwd(), "./client/"),
			server: { middlewareMode: true },
			appType: "spa",
			base: "/",
		});
		router.use(vite.middlewares);
	});
} else {
	router.use(static_(path.join(process.cwd(), "dist", "client")));
}

export default router;

import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { Router } from "express";
import { env } from "@/config/env.js";

// Constants
const isProduction = env.NODE_ENV === "production";
const base = process.env.BASE || "/";

const router = Router();

// Cached production assets
const templateHtml = isProduction
	? await fsp.readFile("./dist/client/index.html", "utf-8")
	: "";

let vite: any;
// Add Vite or respective production middlewares
if (!isProduction) {
	const { createServer } = await import("vite");
	vite = await createServer({
		root: path.resolve(process.cwd(), "./client/"),
		server: { middlewareMode: true },
		appType: "spa",
		base,
	});
	router.use(vite.middlewares);
}

router.get("*", async (req, res) => {
	try {
		if (!isProduction) {
			throw new Error("Unreachable");
		}

		const url = req.originalUrl;
		const segments = url.split("/").filter(Boolean);
		if (segments.length === 0) {
			return res.set({ "Content-Type": "text/html" }).end(templateHtml);
		}

		const filePath = path.join("./dist/client", ...segments);
		if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
			res.sendFile(path.resolve(process.cwd(), filePath));
		} else {
			res.status(404)
				.set({ "Content-Type": "text/html" })
				.end(templateHtml);
		}
	} catch (err: any) {
		vite?.ssrFixStacktrace(err);
		console.log(err.stack);
		res.status(500).end(err.stack);
	}
});

export default router;

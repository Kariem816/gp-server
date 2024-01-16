import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { Response, Router } from "express";
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

function renderIndex(res: Response, status = 200) {
	res.status(status).set({ "Content-Type": "text/html" }).end(templateHtml);
}

router.get("*", async (req, res) => {
	try {
		if (!isProduction) {
			throw new Error("Unreachable");
		}

		const url = req.originalUrl;
		const segments = url.split("/").filter(Boolean);
		if (segments.length === 0) {
			return renderIndex(res);
		}

		const filePath = path.join("./dist/client", ...segments);
		if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
			res.sendFile(path.resolve(process.cwd(), filePath));
		} else if (filePath.includes(".")) {
			renderIndex(res, 404);
		} else {
			renderIndex(res);
		}
	} catch (err: any) {
		vite?.ssrFixStacktrace(err);
		console.log(err.stack);
		renderIndex(res, 500);
	}
});

export default router;

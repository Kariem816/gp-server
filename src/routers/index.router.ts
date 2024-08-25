import { Router } from "express";
import apiRouter from "./api/index.router";
import webRouter from "./web/index.router";

const router = Router();

router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

// router.use("/api", apiRouter);
// router.use("/", webRouter);

router.use("/api", (_req, res) => {
	res.json({
		message:
			"The API has been shutdown due to lack of funds. We could not afford to keep it running. You can still access the code on GitHub (https://github.com/Kariem816/gp-server).",
	});
});
router.use("/", (req, res) => {
	res.send(`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Smart Campus (shutdown)</title>
				<style>
					*, *::before, *::after {
						box-sizing: border-box;
					}

					:root {
						--primary: hsl(221.2 83.2% 53.3%);
						--muted: hsl(210 40% 96.1%);
					}

					body {
						margin: 0;
						padding: 0;
						font-family: Arial, sans-serif;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						gap: 3rem;
						height: 100vh;
						background-color: var(--muted);
					}

					h1 {
						color: var(--primary);
						text-align: center;
					}
				</style>
			</head>
			<body>
				<h1>Smart Campus</h1>
				<p>The website has been shutdown due to lack of funds. We could not afford to keep it running. You can still access the code on <a href="https://github.com/Kariem816/gp-server">GitHub</a>.</p>
			</body>
		</html>
	`);
});

export default router;

import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.render("index", {
		title: "Hello World!",
	});
});

router.get("*", (_req, res) => {
	res.render("not_found", {
		title: "Not found",
	});
});

export default router;

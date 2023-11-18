import { Router } from "express";
import apiRouter from "./api/index.router";
import webRouter from "./web/index.router";

const router = Router();

router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

router.use("/api", apiRouter);
router.use("/", webRouter);

export default router;

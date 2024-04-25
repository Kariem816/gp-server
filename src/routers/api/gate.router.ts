import { Router } from "express";

const router = Router();

router.all("/", (_req, res) => {
	res.status(501).json({
		error: "NOT_IMPLEMENTED",
		message: "This resource is not implemented yet",
	});
});

export default router;

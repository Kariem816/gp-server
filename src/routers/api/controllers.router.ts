import { mustBeController, mustLogin, validateBody } from "@/middlewares";
import { Router } from "express";
import recognizer from "@/config/recognizer";
import { updateReconizerTokenSchema } from "@/schemas/controllers.schema";
import { formatResponse } from "@/helpers";

const router = Router();

router.post(
	"/recognizer-token",
	mustLogin,
	mustBeController,
	validateBody(updateReconizerTokenSchema),
	(req, res) => {
		recognizer.token = req.body.token;
		res.json(formatResponse({ message: "Recognizer token updated" }));
	}
);

export default router;

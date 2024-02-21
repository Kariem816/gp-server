import { mustBeController, mustLogin, validateBody } from "@/middlewares";
import { Router } from "express";
import recognizer from "@/config/recognizer";
import { updateReconizerTokenSchema } from "@/schemas/controllers.schema";

const router = Router();

router.post(
	"/recognizer-token",
	mustLogin,
	mustBeController,
	validateBody(updateReconizerTokenSchema),
	(req, res) => {
		recognizer.token = req.body.token;
		res.json({ message: "Recognizer token updated" });
	}
);

export default router;

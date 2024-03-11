import { mustBe, validateBody } from "@/middlewares";
import { Router } from "express";
import { addCameraSchema } from "@/schemas/controllers.schema";
import { formatError, formatResponse } from "@/helpers";
import controllerStore from "@/models/controllers.model";

const router = Router();

router.post(
	"/camera",
	mustBe("admin"),
	validateBody(addCameraSchema),
	async (req, res) => {
		try {
			await controllerStore.addCamera(req.body);

			res.json(formatResponse({ message: "Camera added" }));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

export default router;

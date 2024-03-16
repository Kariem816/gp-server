import { mustBe, validateBody } from "@/middlewares";
import { Router } from "express";
import { addCameraSchema, newApiKeySchema } from "@/schemas/controllers.schema";
import { formatError, formatResponse } from "@/helpers";
import controllerStore from "@/models/controllers.model";
import { randomBytes } from "crypto";
import { z } from "zod";

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

router.get("/api-keys", mustBe("controller"), async (req, res) => {
	try {
		const user = res.locals.user;

		const apiKeys = await controllerStore.getApiKeysByUserId(user.id);

		res.json(formatResponse(apiKeys));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/api-keys",
	mustBe("controller"),
	validateBody(newApiKeySchema),
	async (req, res) => {
		try {
			const user = res.locals.user;
			const body = req.body as z.infer<typeof newApiKeySchema>;
			const controller = await controllerStore.getControllerByUserId(
				user.id
			);

			const key = randomBytes(32).toString("base64");

			// TODO: check if key/name already exists
			const apiKey = await controllerStore.createApiKey(controller.id, {
				key,
				name: body.name,
				expiresAt: body.expiresAt
					? new Date(body.expiresAt)
					: undefined,
			});

			res.json(formatResponse(apiKey));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/api-keys/:id", mustBe("controller"), async (req, res) => {
	try {
		const user = res.locals.user;

		const controller = await controllerStore.getControllerByUserId(user.id);
		const apiKey = await controllerStore.getApiKeyById(req.params.id);

		if (apiKey.controllerId !== controller.id) {
			return res.status(403).json({
				error: "Forbidden",
				message: "You are not allowed to access this resource",
			});
		}

		await controllerStore.rollApiKey(apiKey.id);

		res.sendStatus(204);
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

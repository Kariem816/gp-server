import { mustBe, validateBody } from "@/middlewares";
import { Router } from "express";
import {
	addCameraSchema,
	newApiKeySchema,
	updateCameraSchema,
	updateControllerSchema,
} from "@/schemas/controllers.schema";
import { formatError, formatResponse } from "@/helpers";
import controllerStore from "@/models/controllers.model";
import { randomBytes } from "crypto";
import { z } from "zod";

const router = Router();

router.get("/controlling", mustBe("controller"), async (_req, res) => {
	try {
		const user = res.locals.user;
		const controller = await controllerStore.getControllerByUserId(user.id);

		res.json(formatResponse(controller.controls));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id/controlling", mustBe("admin"), async (req, res) => {
	try {
		const controller = await controllerStore.getControllerByUserId(
			req.params.id
		);

		res.json(formatResponse(controller.controls));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put(
	"/:id",
	mustBe("admin"),
	validateBody(updateControllerSchema),
	async (req, res) => {
		try {
			const body = req.body as z.infer<typeof updateControllerSchema>;
			await controllerStore.updateController(req.params.id, body);

			res.json(formatResponse({ message: "Controller updated" }));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.get("/camera", mustBe("admin"), async (_req, res) => {
	try {
		const cameras = await controllerStore.getCameras();

		res.json(formatResponse(cameras));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/camera",
	mustBe("admin"),
	validateBody(addCameraSchema),
	async (req, res) => {
		try {
			const camera = req.body as z.infer<typeof addCameraSchema>;
			await controllerStore.addCamera(camera);

			res.json(formatResponse({ message: "Camera added" }));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.put(
	"/camera/:id",
	mustBe("admin"),
	validateBody(updateCameraSchema),
	async (req, res) => {
		try {
			const cameraId = req.params.id;
			await controllerStore.updateCamera(cameraId, req.body);

			res.json(formatResponse({ message: "Camera updated" }));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/camera/:id", mustBe("admin"), async (req, res) => {
	try {
		await controllerStore.deleteCamera(req.params.id);

		res.sendStatus(204);
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

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

			const prevKeys = await controllerStore.getApiKeysByControllerId(
				controller.id
			);

			// Maybe unnecessary, but just in case
			if (
				prevKeys.filter((key) =>
					key.expiresAt ? key.expiresAt > new Date() : true
				).length >= 5
			) {
				return res.status(400).json({
					error: "FORBIDDEN",
					message:
						"You can only have up to 5 keys at a time. Please delete some keys before creating new ones",
				});
			}

			if (prevKeys.some((key) => key.name === body.name)) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: "A key with that name already exists",
				});
			}

			let key = randomBytes(32).toString("base64");
			let existingKey = true;
			do {
				try {
					await controllerStore.getApiKey(key);
					key = randomBytes(32).toString("base64");
				} catch {
					existingKey = false;
				}
			} while (existingKey);

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

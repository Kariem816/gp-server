import { Router } from "express";
import lightingStore from "@/models/lighting.model";
import { formatError, formatResponse } from "@/helpers";
import { validateBody, validateQuery } from "@/middlewares";
import {
	checkManyLightsSchema,
	createLightSchema,
} from "@/schemas/lighting.schema";
import { z } from "zod";
import { shouldTurnOn } from "@/helpers/lights";
import { querySchema } from "@/schemas/query.schema";

const router = Router();

router.get("/", validateQuery(querySchema), async (req, res) => {
	try {
		const query = req.query;

		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : 25;

		const plants = await lightingStore.index({ page, limit });
		res.json(formatResponse(plants));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/", validateBody(createLightSchema), async (req, res) => {
	try {
		const { location } = req.body as z.infer<typeof createLightSchema>;
		const newLight = await lightingStore.create(location);
		res.json(formatResponse(newLight));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/check", validateBody(checkManyLightsSchema), async (req, res) => {
	try {
		const B = req.body as z.infer<typeof checkManyLightsSchema>;
		const lights = await lightingStore.showMany(B.map((l) => l.id));
		const should = shouldTurnOn();
		const state = lights.map((light) => {
			const body = B.find((l) => l.id === light.id)!.body;
			let decision = false;
			if (body === true) {
				decision = should;
			}
			return { id: light.id, state: decision };
		});
		await lightingStore.updateMany(state);
		res.json(formatResponse(state));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		await lightingStore.delete(req.params.id);
		res.sendStatus(204);
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

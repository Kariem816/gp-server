import { Router } from "express";
import lightingStore from "@/models/lighting.model";
import { formatError, formatResponse } from "@/helpers";
import { validateBody, validateQuery } from "@/middlewares";
import {
	checkManyLightsSchema,
	createLightSchema,
	updateManyLightsSchema,
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

router.get("/:id", async (req, res) => {
	try {
		const plant = await lightingStore.show(req.params.id);
		res.json(formatResponse(plant));
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
		const body = req.body as z.infer<typeof checkManyLightsSchema>;
		const lights = await lightingStore.showMany(body.map((l) => l.id));
		const should = shouldTurnOn();
		const state = lights.map((plant) => ({
			id: plant.id,
			// state: shouldTurnOn(plant),
			state: should,
		}));
		res.json(formatResponse(state));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/state",
	validateBody(updateManyLightsSchema),
	async (req, res) => {
		try {
			const body = req.body as z.infer<typeof updateManyLightsSchema>;
			const lights = await lightingStore.updateMany(body);
			res.json(formatResponse(lights));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

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

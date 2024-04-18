import { Router } from "express";
import irrigationStore from "@/models/irrigation.model";
import { formatError, formatResponse } from "@/helpers";
import { validateBody, validateQuery } from "@/middlewares";
import {
	createPlantSchema,
	updateManyPlantsSchema,
	updatePlantSchema,
} from "@/schemas/irrigation.schema";
import { z } from "zod";
import { shouldWater } from "@/helpers/plants";
import { querySchema } from "@/schemas/query.schema";

const router = Router();

router.get("/", validateQuery(querySchema), async (req, res) => {
	try {
		const query = req.query;

		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : 25;

		const plants = await irrigationStore.index({ page, limit });
		res.json(formatResponse(plants));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const plant = await irrigationStore.show(req.params.id);
		res.json(formatResponse(plant));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/", validateBody(createPlantSchema), async (req, res) => {
	try {
		const { type } = req.body as z.infer<typeof createPlantSchema>;
		const newPlant = await irrigationStore.create(type);
		res.json(formatResponse(newPlant));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id/check", async (req, res) => {
	try {
		const plant = await irrigationStore.show(req.params.id);
		const needsWater = shouldWater(plant);
		res.json(formatResponse({ needsWater }));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/check", validateBody(z.array(z.string())), async (req, res) => {
	try {
		const ids = req.body as string[];
		const plants = await irrigationStore.showMany(ids);
		const needsWater = plants.map((plant) => ({
			id: plant.id,
			shouldWater: shouldWater(plant),
		}));
		res.json(formatResponse(needsWater));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/:id/water", validateBody(updatePlantSchema), async (req, res) => {
	try {
		const { isWatering } = req.body as z.infer<typeof updatePlantSchema>;

		const plant = await irrigationStore.update(req.params.id, isWatering);
		res.json(formatResponse(plant));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/water",
	validateBody(updateManyPlantsSchema),
	async (req, res) => {
		try {
			const body = req.body as z.infer<typeof updateManyPlantsSchema>;
			const plants = await irrigationStore.updateMany(body);
			res.json(formatResponse(plants));
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.delete("/:id", async (req, res) => {
	try {
		await irrigationStore.delete(req.params.id);
		res.sendStatus(204);
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

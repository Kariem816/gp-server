import { Router } from "express";
import irrigationStore from "@/models/irrigation.model";
import { formatError, formatResponse } from "@/helpers";
import { validateBody, validateQuery } from "@/middlewares";
import {
	checkManyPlantsSchema,
	createPlantSchema,
	updateManyPlantsSchema,
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

router.post("/check", validateBody(checkManyPlantsSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof checkManyPlantsSchema>;
		const plants = await irrigationStore.showMany(body.map((p) => p.id));
		const needsWater = plants.map((plant) => {
			const moisture = body.find((p) => p.id === plant.id)?.moisture ?? 0;
			return {
				id: plant.id,
				needsWater: shouldWater(plant, moisture),
			};
		});
		res.json(formatResponse(needsWater));
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

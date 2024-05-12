import { Router } from "express";
import parkingstore from "@/models/parking.model.js";
import { formatError, formatResponse } from "@/helpers";
import { validateBody } from "@/middlewares";
import {
	createParkingSpotSchema,
	updateManySpotsSchema,
} from "@/schemas/parking.schema";
import { z } from "zod";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		const park = await parkingstore.index();
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/", validateBody(createParkingSpotSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof createParkingSpotSchema>;
		const park = await parkingstore.create(body.location);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put("/", validateBody(updateManySpotsSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof updateManySpotsSchema>;
		const park = await parkingstore.updateMany(body);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const park = await parkingstore.delete(req.params.id);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

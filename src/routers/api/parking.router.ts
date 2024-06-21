import { Router } from "express";
import parkingstore from "@/models/parking.model.js";
import { formatError, formatResponse } from "@/helpers";
import { mustBe, validateBody, validateQuery } from "@/middlewares";
import {
	createParkingSpotSchema,
	updateManySpotsSchema,
} from "@/schemas/parking.schema";
import { z } from "zod";
import { SmartSpotsUpdateSchema } from "@/schemas/parking.schema";
import { readSmartParkingState } from "@/services/recognizer";
import ParkingImage from "@/helpers/parking";
import { querySchema } from "@/schemas/query.schema";

const router = Router();

const ParkingImg = new ParkingImage(30 * 1000);

router.get("/", validateQuery(querySchema), async (req, res) => {
	try {
		const query = req.query;

		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : 25;

		const spots = await parkingstore.index({ page, limit });
		res.json(formatResponse(spots));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/smart", async (_req, res) => {
	try {
		const park = await parkingstore.showSmart();
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/camera", mustBe("admin"), async (_req, res) => {
	try {
		const img = await ParkingImg.get();
		res.json(formatResponse({ img }));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/", validateBody(createParkingSpotSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof createParkingSpotSchema>;
		const park = await parkingstore.createDumb(body.location);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/smart",
	mustBe("admin"),
	validateBody(SmartSpotsUpdateSchema),
	async (req, res) => {
		try {
			const body = req.body as z.infer<typeof SmartSpotsUpdateSchema>;
			const count = await parkingstore.createSmart(body);

			// TODO: less cringe message
			return res.json(
				formatResponse({ message: `Saved ${count} spots!` })
			);
		} catch (err) {
			const { error, status } = formatError(err);
			res.status(status).json(error);
		}
	}
);

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

router.put("/smart", async (_req, res) => {
	try {
		const spots = await parkingstore.showSmart();
		const parkingImg = await ParkingImg.get();
		const state = await readSmartParkingState(parkingImg, spots);
		await parkingstore.updateMany(
			state.map((s) => ({ ...s, isEmpty: !s.occupied }))
		);
		res.sendStatus(204);
	} catch (err) {
		const { error, status } = formatError(err);
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

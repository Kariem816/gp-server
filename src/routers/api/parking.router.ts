import { Router } from "express";
import parkingstore from "@/models/parking.model.js";
import { formatError, formatResponse } from "@/helpers";
import { mustBe, validateBody } from "@/middlewares";
import {
	createParkingSpotSchema,
	updateManySpotsSchema,
} from "@/schemas/parking.schema";
import { z } from "zod";
import { SmartSpotsUpdateSchema } from "@/schemas/smart-parking.schema";
import { readSmartParkingState } from "@/controllers/recognize.controller";

const router = Router();

// TODO: get image from camera
const IMAGE_URL =
	"https://utfs.io/f/436eb844-bc86-4a0c-b62e-cb0f7d0524f3-sh5vlw.jpg";

router.get("/", async (_req, res) => {
	try {
		const park = await parkingstore.index();
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/smart", mustBe(["admin", "controller"]), async (req, res) => {
	try {
		const park = await parkingstore.showSmart();
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/camera", mustBe("admin"), (_req, res) => {
	res.json({
		data: {
			img: IMAGE_URL,
		},
	});
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

router.put("/smart", mustBe(["admin", "controller"]), async (req, res) => {
	try {
		const spots = await parkingstore.showSmart();
		const state = await readSmartParkingState(IMAGE_URL, spots);
		await parkingstore.updateMany(
			state.map((s) => ({ ...s, isEmpty: !s.occupied }))
		);
		res.sendStatus(204);
	} catch (err) {
		console.error(err);
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

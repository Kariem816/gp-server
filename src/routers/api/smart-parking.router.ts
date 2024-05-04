import { formatError, formatResponse } from "@/helpers";
import { mustBe, validateBody } from "@/middlewares";
import { Router } from "express";
import smartParkingStore from "@/models/smart-parking.model";
import { SmartSpotsUpdateSchema } from "@/schemas/smart-parking.schema";
import { z } from "zod";
import { readSmartParkingState } from "@/controllers/recognize.controller";

const router = Router();

// TODO: get image from camera
const IMAGE_URL =
	"https://utfs.io/f/436eb844-bc86-4a0c-b62e-cb0f7d0524f3-sh5vlw.jpg";

router.get("/", mustBe(["admin", "controller"]), async (req, res) => {
	try {
		const data = await smartParkingStore.index();
		res.json(formatResponse(data));
	} catch (err) {
		const { error, status } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/parking-camera", mustBe("admin"), (_req, res) => {
	res.json({
		data: {
			img: IMAGE_URL,
		},
	});
});

router.post(
	"/",
	mustBe("admin"),
	validateBody(SmartSpotsUpdateSchema),
	async (req, res) => {
		try {
			const body = req.body as z.infer<typeof SmartSpotsUpdateSchema>;
			const count = await smartParkingStore.save(body);

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

router.post("/update", mustBe(["admin", "controller"]), async (req, res) => {
	try {
		const spots = await smartParkingStore.indexForRecognition();
		const state = await readSmartParkingState(IMAGE_URL, spots);
		await smartParkingStore.update(state);
		res.sendStatus(204);
	} catch (err) {
		console.error(err);
		const { error, status } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

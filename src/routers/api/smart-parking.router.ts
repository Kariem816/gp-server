import { formatError, formatResponse } from "@/helpers";
import { mustBe, validateBody } from "@/middlewares";
import { Router } from "express";
import smartParkingStore from "@/models/smart-parking.model";
import { SmartSpotsUpdateSchema } from "@/schemas/smart-parking.schema";
import { z } from "zod";

const router = Router();

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
	// TODO: get image from camera
	res.json({
		data: {
			img: "https://utfs.io/f/436eb844-bc86-4a0c-b62e-cb0f7d0524f3-sh5vlw.jpg",
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

export default router;

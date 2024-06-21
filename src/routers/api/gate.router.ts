import { formatError } from "@/helpers";
import { Router } from "express";
import { RTSP } from "@/helpers";
import controllerStore from "@/models/controllers.model";
import { env } from "@/config/env";
import fs from "fs/promises";
import path from "path";
import { readLP } from "@/controllers/recognize.controller";
import { RouteError } from "@/helpers/response";
import { utapi } from "@/config/ut";

const router = Router();

router.post("/", async (req, res) => {
	let imgPath = "";
	let uploadedKey = "";
	let lp: string[];

	try {
		const camera = await controllerStore.getCamerasByLocation("gate");
		if (camera.length === 0) {
			res.status(404).json({
				error: "NOT_FOUND",
				message: "No camera found for gate",
			});
			return;
		}

		// Initiate RTSP stream
		const cam = new RTSP(
			{
				ip: camera[0].ip,
				username: env.CAMERA_USERNAME,
				password: env.CAMERA_PASSWORD,
			},
			camera[0].tcp
		);

		// Capture image
		imgPath = await cam.capture();

		const uploadResponse = await utapi.uploadFiles(
			new File([await fs.readFile(imgPath)], path.basename(imgPath)),
			{ metadata: {} }
		);

		// handle upload error
		if (uploadResponse.error) {
			throw new RouteError("Error uploading image", 500);
		}

		// process uploaded image
		const uploadedImg = uploadResponse.data;
		uploadedKey = uploadedImg.key;

		try {
			lp = await readLP(uploadedImg.url);
		} catch (err) {
			throw new RouteError("Error processing image", 500);
		}

		// TODO: search for the license plate in the database

		// TODO: if the license plate is found, open the gate

		// TODO: send the correct response
		res.json({ lp });
	} catch (err) {
		const { error, status } = formatError(err);
		res.status(status).json(error);
	} finally {
		await new Promise((resolve) => setTimeout(resolve, 5000));
		if (imgPath) {
			await fs.unlink(imgPath);
		}
		if (uploadedKey) {
			await utapi.deleteFiles(uploadedKey);
		}
	}
});

export default router;

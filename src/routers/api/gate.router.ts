import { formatError } from "@/helpers";
import { Router } from "express";
import { RTSP } from "@/helpers";
import userStore from "@/models/users.model";
import controllerStore from "@/models/controllers.model";
import { env } from "@/config/env";
import fs from "fs/promises";
import path from "path";
import { readLP } from "@/services/recognizer";
import { RouteError, formatResponse } from "@/helpers/response";
import { utapi } from "@/config/ut";
import { FakeRTSP } from "@/helpers/rtsp";

const router = Router();

router.post("/", async (req, res) => {
	// let imgPath = "";
	let imgUrl = "";
	// let uploadedKey = "";
	let lps: string[];

	try {
		const camera = await controllerStore.getCamerasByLocation("gate");
		if (camera.length === 0) {
			res.status(404).json({
				error: "NOT_FOUND",
				message: "No camera found for gate",
			});
			return;
		}

		// TODO: uncomment when we buy the camera
		// Initiate RTSP stream
		// const cam = new RTSP(
		// 	{
		// 		ip: camera[0].ip,
		// 		username: env.CAMERA_USERNAME,
		// 		password: env.CAMERA_PASSWORD,
		// 	},
		// 	camera[0].tcp
		// );
		const cam = new FakeRTSP();

		// Capture image
		// imgPath = await cam.capture();
		imgUrl = await cam.capture();

		// const uploadResponse = await utapi.uploadFiles(
		// 	new File([await fs.readFile(imgPath)], path.basename(imgPath)),
		// 	{ metadata: {} }
		// );

		// // handle upload error
		// if (uploadResponse.error) {
		// 	throw new RouteError("Error uploading image", 500);
		// }

		// // process uploaded image
		// const uploadedImg = uploadResponse.data;
		// uploadedKey = uploadedImg.key;

		try {
			// lp = await readLP(uploadedImg.url);
			lps = await readLP(imgUrl);
		} catch (err) {
			throw new RouteError("Error processing image", 500);
		}

		const users = await userStore.getByLicensePlates(lps);

		res.json(
			formatResponse({
				decision: users.length > 0,
			})
		);
	} catch (err) {
		const { error, status } = formatError(err);
		res.status(status).json(error);
	} finally {
		// await new Promise((resolve) => setTimeout(resolve, 5000));
		// if (imgPath) {
		// 	await fs.unlink(imgPath);
		// }
		// if (uploadedKey) {
		// 	await utapi.deleteFiles(uploadedKey);
		// }
	}
});

export default router;

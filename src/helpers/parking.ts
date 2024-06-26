import { RTSP } from "./rtsp";
import { env } from "@/config/env";
import controllerStore from "@/models/controllers.model";
import uploadStore from "@/models/uploads.model";
import { utapi } from "@/config/ut";
import fs from "fs/promises";
import path from "path";

const FALLBACK_LINK =
	"https://cdn.discordapp.com/attachments/1067863167075631176/1254081572240621579/f0665122-e5ec-4fce-b526-03eb363f143e.png?ex=667831fa&is=6676e07a&hm=349dfd5ed757511fe9790864b458042fca88d9bd48dc47e56a9a39d3ff0f8538&";

async function getParkingImg(): Promise<string> {
	try {
		const cameras = await controllerStore.getCamerasByLocation("parking");
		if (!cameras.length) {
			throw new Error("No cameras found");
		}
		const cam = new RTSP(
			{
				ip: cameras[0].ip,
				username: env.CAMERA_USERNAME,
				password: env.CAMERA_PASSWORD,
			},
			cameras[0].tcp
		);

		const imgPath = await cam.capture();

		const prevImg = await uploadStore.showByName("parking");
		if (prevImg) {
			await utapi.deleteFiles(prevImg.key);
		}

		const metadata = { parking: true };
		const uploadResponse = await utapi.uploadFiles(
			new File([await fs.readFile(imgPath)], path.basename(imgPath)),
			{ metadata: {} }
		);
		fs.unlink(imgPath);

		// handle upload error
		if (uploadResponse.error) {
			throw new Error("Error uploading image");
		}

		// process uploaded image
		const uploadedImg = uploadResponse.data;

		await uploadStore.create({
			...uploadedImg,
			metadata,
			name: "parking",
		});

		return uploadedImg.url;
	} catch (err) {
		console.error(err);
		return FALLBACK_LINK;
	}
}

export default class ParkingImage {
	private img: string;
	private lastUpdate: Date;

	constructor(public updateIntervalMS = 1000 * 30) {
		this.img = FALLBACK_LINK;
		this.lastUpdate = new Date();
	}

	async get(): Promise<string> {
		if (
			!this.img ||
			!this.lastUpdate ||
			Date.now() - this.lastUpdate.getTime() > this.updateIntervalMS
		) {
			this.img = await getParkingImg();
			this.lastUpdate = new Date();
		}
		return this.img;
	}
}

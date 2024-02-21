import { Router } from "express";
import { routerError, uploadToVersion } from "@/helpers/index";
import uploadStore from "@/models/uploads.model";
import sessionStore from "@/models/sessions.model";
import { mustBeAdmin, validateBody, validateQuery } from "@/middlewares/index";
import {
	downloadAPKSchema,
	updateAPKSchema,
	updateURLSchema,
} from "@/schemas/mobile.schema";
import { utapi } from "@/config/ut";
import { isVersion, parseVersion } from "@/utils/versions";
import { sendNotifications } from "@/helpers/notifications";

import type { Prisma } from "@prisma/client";

type AppUploadMetadata = {
	version: string;
};

const router = Router();

router.get("/", validateQuery(downloadAPKSchema), async (req, res) => {
	try {
		if (req.query.version) {
			const version = req.query.version as string;
			const url = await uploadStore.getVersionURL(version);
			if (!url) {
				return res.status(404).json({
					error: "NOT_FOUND",
					message: "Requested version is not available",
				});
			}

			return res.json({ url });
		}

		const appUpload = await uploadStore.showByName("mobile-apk");

		if (!appUpload) {
			throw new Error("Downloading the app is currently unavailable");
		}

		res.json({ url: appUpload.url });
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/latest", async (_req, res) => {
	try {
		const uploads = await uploadStore.getAllMetadataByName("mobile-apk");

		if (uploads.length === 0) {
			throw new Error("Downloading the app is currently unavailable");
		}

		const versions = uploads
			.map((u) => uploadToVersion(u))
			.filter(isVersion);

		res.status(200).json({ version: versions[0] });
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/update", validateQuery(updateAPKSchema), async (req, res) => {
	try {
		const { version } = req.query;

		const appUpload = await uploadStore.showByName("mobile-apk");

		if (!appUpload) {
			return res.status(200).json({ update: false });
		}

		if (!version) {
			return res.status(200).json({ update: false });
		}

		const { number: currentVersionNumber } = parseVersion(
			version as string
		);
		const { number: latestVersionNumber } = parseVersion(
			uploadToVersion(appUpload, "0.0.0")
		);

		if (
			currentVersionNumber > latestVersionNumber &&
			currentVersionNumber !== 0
		) {
			return res.status(200).json({ update: false });
		}

		res.status(200).json({
			update: currentVersionNumber !== latestVersionNumber,
		});
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/versions", async (_req, res) => {
	try {
		const uploads = await uploadStore.getAllMetadataByName("mobile-apk");

		if (uploads.length === 0) {
			return res.status(200).json({ versions: [] });
		}

		const versions = uploads
			.map((upload) => {
				if (typeof upload.metadata === "object") {
					const md =
						upload.metadata as Prisma.JsonObject as AppUploadMetadata;
					return md.version;
				}
				return "";
			})
			.filter(isVersion);

		res.status(200).json({ versions });
	} catch (err) {
		routerError(err, res);
	}
});

router.post(
	"/",
	mustBeAdmin,
	validateBody(updateURLSchema),
	async (req, res) => {
		try {
			const { url, version } = req.body;

			let oldVersion = "0.0.0";
			let oldVersionNumber = 0;

			const oldUpload = await uploadStore.showByName("mobile-apk");
			if (oldUpload) {
				const oldVersion = uploadToVersion(oldUpload);
				oldVersionNumber = parseVersion(oldVersion).number;
			}

			const { number: newVersionNumber } = parseVersion(version);

			if (newVersionNumber <= oldVersionNumber) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: `Version must be greater than the previous version (${oldVersion})`,
				});
			}

			const resp = await utapi.uploadFilesFromUrl(url, {
				metadata: { version },
				contentDisposition: "inline",
			});

			if (Array.isArray(resp)) {
				// This should never happen, because we're only uploading one file
				throw "Unreachable";
			}

			// Register the new file in the database
			await uploadStore.create({
				...resp.data,
				name: "mobile-apk",
				metadata: { version },
			});

			res.sendStatus(200);

			const notificationTokens =
				await sessionStore.getAllNotificationTokens();

			// TODO: maybe save ticket ids in db
			await sendNotifications(notificationTokens, {
				title: "New app version available",
				body: `A new version of the app is available. Please update to version ${version} from the app settings.`,
			});

			if (resp?.data?.key) {
				utapi.renameFile({
					fileKey: resp?.data?.key,
					newName: `smart-campus-app-${version}.apk`,
				});
			} else {
				throw new Error("Unreachable");
			}
		} catch (err) {
			routerError(err, res);
		}
	}
);

export default router;

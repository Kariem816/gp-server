import { Router, json } from "express";

import { createUploadthingExpressHandler } from "uploadthing/express";

import { uploadRouter } from "@/config/uploads.js";

const router = Router();

// Why can't UploadThing send correct content-type header?
router.use((req, res, next) => {
	req["headers"]["content-type"] = "application/json";
	next();
}, json());

router.use(
	createUploadthingExpressHandler({
		router: uploadRouter,
	})
);

export default router;

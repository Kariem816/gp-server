import { Router } from "express";

import { createUploadthingExpressHandler } from "uploadthing/express";

import { uploadRouter } from "@/config/uploads";

const router = Router();

router.use(
	createUploadthingExpressHandler({
		router: uploadRouter,
	})
);

export default router;

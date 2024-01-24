import { Router, json } from "express";
import { uploadController } from "@/controllers/upload.controller.js";

const router = Router();

// Why can't UploadThing send correct content-type header?
router.use((req, _res, next) => {
	req["headers"]["content-type"] = "application/json";
	next();
}, json());

router.use(uploadController);

export default router;

import { Router, json } from "express";
import { uploadController } from "@/controllers/upload.controller";

const router = Router();

// Why can't UploadThing send correct content-type header?
router.use((req, _res, next) => {
	if (req.headers["content-type"] === "multipart/form-data") return next();
	req["headers"]["content-type"] = "application/json";
	next();
}, json());
router.use(uploadController);

export default router;

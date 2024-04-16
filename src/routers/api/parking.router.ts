import { Router } from "express";
import parkingstore from "@/models/parking.model.js"; 
import { formatError, formatResponse } from "@/helpers";


const router = Router();

router.post("/", async (req, res) => {
	try {
		const park = await parkingstore.create(req.body.location);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});



router.put("/:id", async (req, res) => {
	try {
		const park = await parkingstore.update(req.params.id, req.body.isEmpty);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});



router.delete("/:id", async (req, res) => {
	try {
		const park = await parkingstore.delete(req.params.id);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/", async (req, res) => {
	try {
		const park = await parkingstore.index();
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});


router.get("/:id", async (req, res) => {
	try {
		const park = await parkingstore.show(req.params.id);
		res.json(formatResponse(park));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});




export default router;
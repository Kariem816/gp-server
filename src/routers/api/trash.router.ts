import { Router } from "express";
import trashStore from "@/models/trash.model";
import { formatError, formatResponse } from "@/helpers";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const trash = await trashStore.index();
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const trash = await trashStore.show(req.params.id);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post("/", async (req, res) => {
	try {
		const trash = await trashStore.create(req.body);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const trash = await trashStore.update(req.params.id, req.body);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const trash = await trashStore.delete(req.params.id);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

export default router;

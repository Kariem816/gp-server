import { Router } from "express";
import trashStore from "@/models/trash.model";
import { formatError, formatResponse } from "@/helpers";
import { validateBody, validateQuery } from "@/middlewares";
import {
	createTrashSchema,
	editTrashBulkSchema,
	editTrashSchema,
	updateTrashLevelBulkSchema,
	updateTrashLevelSchema,
} from "@/schemas/trash.schema";
import { z } from "zod";
import { querySchema } from "@/schemas/query.schema";

const router = Router();

router.get("/", validateQuery(querySchema), async (req, res) => {
	try {
		const query = req.query;

		const page = query.page ? Number(query.page) : 1;
		const limit = query.limit ? Number(query.limit) : 25;

		const trash = await trashStore.index({ page, limit });
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

router.post("/", validateBody(createTrashSchema), async (req, res) => {
	try {
		const trash = req.body as z.infer<typeof createTrashSchema>;
		const newTrash = await trashStore.create(trash);
		res.json(formatResponse(newTrash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put("/", validateBody(updateTrashLevelBulkSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof updateTrashLevelBulkSchema>;
		const trash = await trashStore.updateMany(body);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const body = req.body as z.infer<typeof updateTrashLevelSchema>;
		const trash = await trashStore.update(req.params.id, body);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.patch("/", validateBody(editTrashBulkSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof editTrashBulkSchema>;
		const trash = await trashStore.editMany(body);
		res.json(formatResponse(trash));
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.patch("/:id", validateBody(editTrashSchema), async (req, res) => {
	try {
		const body = req.body as z.infer<typeof editTrashSchema>;
		const trash = await trashStore.edit(req.params.id, body);
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

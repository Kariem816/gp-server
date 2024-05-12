import { Router } from "express";
import trashStore from "@/models/trash.model";
import { formatError, formatResponse } from "@/helpers";
import { mustBe, validateBody, validateQuery } from "@/middlewares";
import {
	createTrashSchema,
	editTrashBulkSchema,
	updateTrashLevelBulkSchema,
} from "@/schemas/trash.schema";
import { z } from "zod";
import { querySchema } from "@/schemas/query.schema";
import { notifyFilledTrash } from "@/helpers/trash";

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
		const oldTrash = await trashStore.showMany(body.map((t) => t.id));

		const trash = await trashStore.updateMany(
			body.map((t) => {
				const oldLevel =
					oldTrash.find((o) => o.id === t.id)?.level ?? 0;

				return {
					...t,
					lastEmptied: t.level < oldLevel ? new Date() : undefined,
				};
			})
		);

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

router.post("/notify", mustBe("controller"), async (_req, res) => {
	try {
		const trash = await trashStore.getFilledTrash();
		if (trash.length === 0) {
			return res.json(
				formatResponse({ message: "No trash cans are filled" })
			);
		}

		const luckyOnes = await notifyFilledTrash(trash);
		res.json(
			formatResponse({
				message: `Notifications sent to ${
					luckyOnes.length
				} workers to empty
					${trash.length} trash cans. ${
					trash.filter((t) => t.level < 70).length || "None"
				} of them were old.`,
			})
		);
	} catch (err) {
		console.error(err);
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

import { Router } from "express";
import graphStore_temp from "@/models/graph.model.temp";
import { formatError } from "@/helpers";
import { mustBe, validateBody } from "@/middlewares";
import {
	createGraphSchema,
	updateGraphSchema,
} from "@/schemas/graph.schema.temp";
import { z } from "zod";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		const data = await graphStore_temp.index();
		res.json(data);
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const id = Number(req.params.id);

		if (isNaN(id)) {
			return res.status(400).json({
				error: "BAD_REQUEST",
				message: "Invalid Id",
			});
		}

		const data = await graphStore_temp.show(id);
		res.json(data);
	} catch (err) {
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
});

router.post(
	"/",
	mustBe("controller"),
	validateBody(createGraphSchema),
	async (req, res) => {
		try {
			const body = req.body as z.infer<typeof createGraphSchema>;

			const exists = await graphStore_temp.exists(body.label);
			if (exists) {
				return res.status(409).json({
					error: "CONFLICT",
					message: "Label already exists",
				});
			}

			const data = await graphStore_temp.create(body);
			res.json(data);
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

router.post(
	"/:id",
	mustBe("controller"),
	validateBody(updateGraphSchema),
	async (req, res) => {
		try {
			const id = Number(req.params.id);

			if (isNaN(id)) {
				return res.status(400).json({
					error: "BAD_REQUEST",
					message: "Invalid Id",
				});
			}

			const body = req.body as z.infer<typeof updateGraphSchema>;

			const data = await graphStore_temp.update(id, body.value);
			res.json(data);
		} catch (err) {
			const { status, error } = formatError(err);
			res.status(status).json(error);
		}
	}
);

export default router;

import { Router } from "express";
import { parseFilters, validateQuery } from "@/middlewares";
import { querySchema } from "@/schemas/query.schema";
import teacherStore from "@/models/teachers.model";
import { routerError } from "@/helpers";

const router = Router();

router.get("/", validateQuery(querySchema), parseFilters, async (req, res) => {
	try {
		const page = Number(req.query.page) || 1;
		const limit = Number(req.query.limit) || 50;
		const filters = res.locals.filters;

		const teachers = await teacherStore.index({
			page,
			limit,
			filters,
		});

		res.json(teachers);
	} catch (err: any) {
		routerError(err, res);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const teacher = await teacherStore.show(req.params.id);
		res.json(teacher);
	} catch (err: any) {
		routerError(err, res);
	}
});

export default router;

import { Router } from "express";
import trashStore from "@/models/trash.model";
import { routerError } from "@/helpers/index";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const trash = await trashStore.index();
		res.json(trash);
	} catch (err) {
		routerError(err, res);
	}
});

router.get("/:id", async (req, res) => {
	try {
		const trash = await trashStore.show(req.params.id);
		res.json(trash);
	} catch (err) {
		routerError(err, res);
	}
});

router.post("/", async (req, res) => {
	try {
		const trash = await trashStore.create(req.body);
		res.json(trash);
	} catch (err) {
		routerError(err, res);
	}
});

router.put("/:id", async (req, res) => {
	try {
		const trash = await trashStore.update(req.params.id, req.body);
		res.json(trash);
	} catch (err) {
		routerError(err, res);
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const trash = await trashStore.delete(req.params.id);
		res.json(trash);
	} catch (err) {
		routerError(err, res);
	}
});

export default router;

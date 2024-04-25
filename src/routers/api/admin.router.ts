import { mustBe } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.get("/parking-camera", mustBe("admin"), (_req, res) => {
	res.json({
		data: {
			img: "https://utfs.io/f/436eb844-bc86-4a0c-b62e-cb0f7d0524f3-sh5vlw.jpg",
		},
	});
});

export default router;

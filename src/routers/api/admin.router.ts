import { mustBe } from "@/middlewares";
import { Router } from "express";

const router = Router();

router.get("/parking-camera", mustBe("admin"), (_req, res) => {
	res.json({
		data: {
			img: "https://t4.ftcdn.net/jpg/00/97/58/97/240_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg",
		},
	});
});

export default router;

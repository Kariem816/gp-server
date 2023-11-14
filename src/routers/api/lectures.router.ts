import { Router } from "express";
import lectureStore from "@/models/lectures.model";
import { mustBeAdmin, parseFilters } from "@/middlewares";
import { routerError } from "@/helpers";

const router = Router();

export default router;

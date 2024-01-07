import type { Request, Response, NextFunction } from "express";
import { collectFileters } from "@/helpers/filters.js";

export function parseFilters(req: Request, res: Response, next: NextFunction) {
	res.locals.filters = collectFileters(req.query);
	next();
}

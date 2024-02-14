import type { Request, Response, NextFunction } from "express";
import { collectFileters } from "@/helpers/filters";

export function parseFilters(req: Request, res: Response, next: NextFunction) {
	res.locals.filters = collectFileters(req.query);
	next();
}

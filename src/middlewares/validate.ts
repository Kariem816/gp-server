import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export function validateBody<T = any>(schema: ZodSchema<T>) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			await schema.parseAsync(req.body);
			next();
		} catch (err: any) {
			console.log(err.errors);
			res.status(400).json({
				error: "BAD_REQUEST",
				message: err.errors,
			});
		}
	};
}

export function validateQuery<T = any>(schema: ZodSchema<T>) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			await schema.parseAsync(req.query);
			next();
		} catch (err: any) {
			console.log(err.errors);
			res.status(400).json({
				error: "BAD_REQUEST",
				message: err.errors,
			});
		}
	};
}

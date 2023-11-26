import type { Request, Response, NextFunction } from "express";
import type { ZodSchema, ZodError } from "zod";

function formatZodError(error: ZodError<any>) {
	return error.errors.map((err) => {
		const path = err.path.join(".");
		return {
			path,
			message: err.message,
		};
	});
}

export function validateBody<T = any>(schema: ZodSchema<T>) {
	return async function (req: Request, res: Response, next: NextFunction) {
		try {
			await schema.parseAsync(req.body);
			next();
		} catch (err: any) {
			res.status(400).json({
				error: "BAD_REQUEST",
				messages: formatZodError(err),
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
			res.status(400).json({
				error: "BAD_REQUEST",
				messages: formatZodError(err),
			});
		}
	};
}

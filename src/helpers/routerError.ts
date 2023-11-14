import type { Response } from "express";

export function routerError(err: any, res: Response) {
	if (err.httpStatus)
		res.status(err.httpStatus).json({
			error: err.longMessage,
			message: err.simpleMessage,
		});
	else
		res.status(500).json({
			error: "INTERNAL_SERVER_ERROR",
			message: err.message,
		});
}

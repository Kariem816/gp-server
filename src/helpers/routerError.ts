import { PrismaError } from "@/config/db";
import type { Response } from "express";

export function routerError(err: any, res: Response) {
	console.error(err);
	if (err instanceof PrismaError)
		console.log("I am a prisma error 😊"),
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

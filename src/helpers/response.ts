import { PrismaError } from "@/config/db";

export function formatError(err: any) {
	if (err instanceof PrismaError)
		return {
			error: {
				error: err.longMessage,
				message: err.simpleMessage,
			},
			status: err.httpStatus,
		};
	else
		return {
			error: {
				error: "INTERNAL_SERVER_ERROR",
				message: err.message,
			},
			status: 500,
		};
}

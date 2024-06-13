import { PrismaError } from "@/config/db";
import { getErrorCodeFromHttpStatus } from "@/utils/http";

export class RouteError extends Error {
	httpStatus: number;
	constructor(message: string, httpStatus: number) {
		super(message);
		this.httpStatus = httpStatus;
	}
}

export function formatError(err: any) {
	if (err instanceof PrismaError) {
		return {
			error: {
				error: err.longMessage,
				message: err.simpleMessage,
			},
			status: err.httpStatus,
		};
	} else if (err instanceof RouteError) {
		return {
			error: {
				error:
					getErrorCodeFromHttpStatus(err.httpStatus) ??
					"UNKNOWN_ERROR",
				message: err.message,
			},
			status: err.httpStatus,
		};
	} else {
		return {
			error: {
				error: "INTERNAL_SERVER_ERROR",
				message: err.message,
			},
			status: 500,
		};
	}
}

const infoKeys = [
	"page",
	"length",
	"count",
	"total",
	"next",
	"prev",
	"last",
	"first",
];

export function formatResponse(resp: any) {
	if (Array.isArray(resp)) {
		return {
			data: resp,
		};
	}

	if (typeof resp !== "object") {
		return {
			data: resp,
		};
	}

	if (Array.isArray(resp.data)) {
		const data = resp.data;
		const info: any = {};
		for (const key in resp) {
			if (key === "data") continue;
			else if (infoKeys.includes(key)) info[key] = resp[key];
			else data[key] = resp[key];
		}

		return {
			data,
			...info,
		};
	}

	let data: any = {};
	const info: any = {};

	for (const key in resp) {
		if (key === "data") {
			data = {
				...data,
				...resp[key],
			};
		} else if (infoKeys.includes(key)) info[key] = resp[key];
		else data[key] = resp[key];
	}

	return {
		data,
		...info,
	};
}

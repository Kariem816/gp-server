import { env } from "@/config/env";

import type { Request, Response, NextFunction } from "express";

const AVAILABLE_FIELDS = [
	"baseUrl",
	"body",
	"cookies",
	"fresh",
	"headers",
	"hostname",
	"ip",
	"ips",
	"method",
	"originalUrl",
	"params",
	"path",
	"protocol",
	"query",
	"route",
	"secure",
	"signedCookies",
	"stale",
	"subdomains",
	"xhr",
] as const;

type LoggerOptions = {
	debugOnly?: boolean;
	fields?: (typeof AVAILABLE_FIELDS)[number][];
};

export function logger({ debugOnly = false, fields = [] }: LoggerOptions) {
	return (req: Request, _res: Response, next: NextFunction) => {
		if (debugOnly && env.NODE_ENV !== "development") return next();
		console.log(
			"============================== New Request ============================"
		);
		fields.forEach((field) => {
			console.log(`${field}:`, req[field] ?? "undefined");
		});
		console.log(
			"======================================================================="
		);
		next();
	};
}

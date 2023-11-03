import type { Request } from "express";

export function collectFileters(query: Request["query"]) {
	const filters: Record<string, any> = {};

	for (const key in query) {
		if (key.startsWith("filter_")) {
			let value = "";
			try {
				value = JSON.parse(query[key] as string);
			} catch {
				value = query[key] as string;
			}
			const field = key.replace("filter_", "");

			filters[field] = value;
		}
	}

	return filters;
}

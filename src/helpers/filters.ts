import type { Request } from "express";

export function collectFileters(query: Request["query"]) {
	const filters: Record<string, any> = {};
	const extended = "extended_filters" in query;

	for (const key in query) {
		if (key.startsWith("filter_")) {
			let value = "";
			try {
				value = JSON.parse(query[key] as string);
			} catch {
				value = query[key] as string;
			}
			const field = key.replace("filter_", "");

			if (extended && extendedFilters[field]) {
				filters[field] = extendedFilters[field](value);
			} else {
				filters[field] = value;
			}
		}
	}

	return filters;
}

const extendedFilters: Record<string, any> = {
	name: (nameVlaue: any) => ({
		contains: nameVlaue,
		mode: "insensitive",
	}),
};

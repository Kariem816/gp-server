import { get } from "./api";

import type { APIQuery } from "~/types/query";

export type TrashCan = {
	id: string;
	level: number;
	location: string;
	lastEmptied: string; // ISO Date
};

export async function getAllCans(
	query: APIQuery = {}
): Promise<PaginatedResponse<TrashCan>> {
	return get("/trash", query);
}

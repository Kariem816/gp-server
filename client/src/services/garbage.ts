import { del, get, patch, post } from "./api";

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

export async function createCan(data: {
	location: string;
}): Promise<APIResponse<TrashCan>> {
	return post("/trash", data);
}

export async function updateCan(
	id: string,
	data: {
		location: string;
	}
): Promise<APIResponse<TrashCan>> {
	return patch("/trash/" + id, data);
}

export async function deleteCan(id: string): Promise<void> {
	return del(`/trash/${id}`);
}

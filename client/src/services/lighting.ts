import { del, get, patch, post } from "./api";
import type { APIQuery } from "~/types/query";
export type LightSpot = {
    id: string;
    state: boolean;
    location: string;
}
export async function getAllLamps(query: APIQuery = {}): Promise<PaginatedResponse<LightSpot>> {
    return get("/lighting", query);
}
export async function createLamp(data: {
	location: string;
}): Promise<APIResponse<LightSpot>> {
	return post("/lighting", data);
}
export async function updateLamp(
	id: string,
	data: {
    	location: string;
	}
): Promise<APIResponse<LightSpot>> {
	return patch("/lighting/" + id, data);
}

export async function deleteLamp(id: string): Promise<void> {
	return del(`/lighting/${id}`);
}

import { del, get, patch, post } from "./api";
import type { APIQuery } from "~/types/query";
export type Plants = {
    id: string;
    lastUpdated: string;
    isWatering: boolean;
    type:string;
}
	
export async function getAllPlants(query: APIQuery = {}): Promise<PaginatedResponse<Plants>> {
    return get("/irrigation", query);
}
export async function createPlant(data: {
	type: string;
}): Promise<APIResponse<Plants>> {
	return post("/irrigation", data);
}
export async function updatePlant(
	id: string,
	data: {
    	isWatering: boolean;
	}
): Promise<APIResponse<Plants>> {
	return patch("/irrigation/" + id, data);
}

export async function deletePlant(id: string): Promise<void> {
	return del(`/irrigation/${id}`);
}




import { get, post } from "./api";

import type { APIQuery } from "~/types/query";

export type ParkingSpot = {
	id: number;
	isEmpty: boolean;
	location: string;
	isSmart: boolean;
};

export type SmartSpot = ParkingSpot & {
	poly: [number, number][];
};

export type ParkingSpotCreate = {
	location: string;
};

export type SmartSpotCreate = {
	location: string;
	poly: [number, number][];
};

export async function getAllSpots(
	query: APIQuery = {}
): Promise<APIResponse<ParkingSpot[]>> {
	return get("/parking", query);
}

export async function getParkingOverview(): Promise<
	APIResponse<{ img: string }>
> {
	return get("/parking/camera");
}

export async function getSmartSpots(): Promise<APIResponse<SmartSpot[]>> {
	return get("/parking/smart");
}

export async function saveParkingSpots(
	spots: SmartSpotCreate[]
): Promise<APIResponse<{ message: string }>> {
	return post("/parking/smart", spots);
}

import { get, post } from "./api";

export type ParkingSpotCreate = {
	location: string;
	poly: [number, number][];
};

export type ParkingSpot = {
	id: number;
	location: string;
	poly: [number, number][];
	isEmpty: boolean;
};

export async function getParkingOverview(): Promise<
	APIResponse<{ img: string }>
> {
	return get("/smart-parking/parking-camera");
}

export async function getParkingSpots(): Promise<APIResponse<ParkingSpot[]>> {
	return get("/smart-parking");
}

export async function saveParkingSpots(
	spots: ParkingSpotCreate[]
): Promise<APIResponse<{ message: string }>> {
	return post("/smart-parking", spots);
}

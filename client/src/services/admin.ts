import { get } from "./api";

export async function getParkingOverview(): Promise<
	APIResponse<{ img: string }>
> {
	return get("/admin/parking-camera");
}

import { del, get, put, post } from "./api";

export type Camera = {
	id: string;
	ip: string;
	location: string;
	tcp: boolean;
};

export async function getCameras(): Promise<APIResponse<Camera[]>> {
	return get("/controllers/camera");
}

export async function createCamera(data: {
	location: string;
	ip: string;
	tcp?: boolean;
}): Promise<APIResponse<Camera>> {
	return post("/controllers/camera", data);
}

export async function updateCamera(
	id: string,
	data: Partial<Camera>
): Promise<APIResponse<Camera>> {
	return put(`/controllers/camera/${id}`, data);
}

export async function deleteCamera(id: string): Promise<void> {
	return del(`/controllers/camera/${id}`);
}

import { del, get, post, put } from "./api";

import type { APIQuery } from "~/types/query";

export async function getUsers(query: APIQuery = {}) {
	return get("/users", query);
}

export async function getUser(id: string) {
	return get(`/users/${id}`);
}

export async function deleteUser(id: string) {
	return del(`/users/${id}`);
}

export async function getMyImages(): Promise<APIResponse<string[]>> {
	return get("/users/my-imgs");
}

export async function getUserImages(
	userId: string
): Promise<APIResponse<string[]>> {
	return get(`/users/${userId}/imgs`);
}

export async function updateLiscencePlate(licensePlate: string) {
	return put(`/users/license-plate`, { licensePlate });
}

export async function deleteLiscencePlate() {
	return del(`/users/license-plate`);
}

export async function notifyUser(
	id: string,
	notification: { title: string; body: string }
) {
	return post(`/users/${id}/notify`, notification);
}

export async function notifyAllUsers(notification: {
	title: string;
	body: string;
}) {
	return post(`/users/notify`, { ...notification, all: true });
}

export async function notifyMultipleUsers(
	userIds: string[],
	notification: { title: string; body: string }
) {
	return post(`/users/notify`, { ...notification, userIds });
}

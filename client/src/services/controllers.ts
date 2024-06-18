import { get, post, del, put } from "./api";

import type { Controller } from "~/types/users";

export const controlElements = [
	"attendance",
	"gate",
	"parking",
	"garbage",
	"irrigation",
	"lighting",
	"image",
] as const;
export type ControlElement = (typeof controlElements)[number];

export type TAPIKey = {
	id: string;
	key: string;
	name: string;
	createdAt: string; // ISO Date
	expiresAt?: string; // ISO Date
};

export async function getMyPermissions(): Promise<APIResponse<string[]>> {
	return get("/controllers/controlling");
}

export async function getControllerPermissions(
	id: string
): Promise<APIResponse<ControlElement[]>> {
	return get(`/controllers/${id}/controlling`);
}

export async function getMyApiKeys(): Promise<APIResponse<TAPIKey[]>> {
	return get("/controllers/api-keys");
}

export async function createApiKey(keyInfo: {
	name: string;
	expiresAt?: Date;
}): Promise<APIResponse<TAPIKey>> {
	return post("/controllers/api-keys", keyInfo);
}

export async function rollApiKey(id: string): Promise<void> {
	return del(`/controllers/api-keys/${id}`);
}

export async function registerController(controllerData: {
	user: {
		name: string;
		username: string;
		password: string;
	};
	controller: {
		controls: Controller["controller"]["controls"];
		location?: string | undefined;
	};
}) {
	return post(`/users/register/controller`, controllerData);
}

export async function updateController(
	id: string,
	data: {
		controls: Controller["controller"]["controls"];
		location?: string | undefined;
	}
) {
	return put(`/controllers/${id}`, data);
}

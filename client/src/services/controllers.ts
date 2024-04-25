import { get, post, del } from "./api";

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

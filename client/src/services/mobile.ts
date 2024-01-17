import { get, post } from "./api";

export async function getLatestVersion(): Promise<{ version: string }> {
	return get("/mobile/latest");
}

export async function getVersionUrl(
	version: string = ""
): Promise<{ url: string }> {
	return get("/mobile", { version });
}

export async function uploadMobileApp(
	url: string,
	version: string
): Promise<void> {
	return post("/mobile", { url, version });
}

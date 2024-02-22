import { get, post } from "./api";

export async function getLatestVersion(): Promise<{
	data: { version: string };
}> {
	return get("/mobile/latest");
}

export async function getVersionUrl(
	version: string = ""
): Promise<{ data: { url: string } }> {
	return get("/mobile", { version });
}

export async function uploadMobileApp(
	url: string,
	version: string
): Promise<void> {
	return post("/mobile", { url, version });
}

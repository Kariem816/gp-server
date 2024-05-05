import axios from "axios";

import type { APIQuery } from "~/types/query";

export const serverURL = import.meta.env.DEV
	? import.meta.env.VITE_APP_SERVER_URL
	: "";

const api = axios.create({
	baseURL: serverURL + "/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

export default api;

export function getAPIToken(): string {
	return (
		(api.defaults.headers.common["Authorization"] as string | undefined) ??
		""
	);
}

export function setAPIToken(token: string) {
	api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export function removeAPIToken() {
	delete api.defaults.headers.common["Authorization"];
}

export async function makeRequest(url: string, options: object) {
	try {
		const res = await api(url, options);
		const data = res.data;
		return data;
	} catch (error: any) {
		if (!error.response) {
			throw {
				error: "Connection Error",
				message:
					"Couldn't connect to the server. Please try again later",
			};
		}
		throw error.response.data;
	}
}

export function get(url: string, query: APIQuery = {}) {
	const params = new URLSearchParams();

	Object.entries(query).forEach(([key, value]) => {
		if (value) {
			if (typeof value === "string") params.append(key, value);
			else params.append(key, value.toString());
		}
	});

	return makeRequest(url + "?" + params.toString(), {
		method: "GET",
	});
}

export function post(url: string, data = {}, isFormData = false) {
	if (isFormData) {
		return makeRequest(url, {
			method: "POST",
			data,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}

	return makeRequest(url, {
		method: "POST",
		data: JSON.stringify(data),
	});
}

export function put(url: string, data = {}) {
	return makeRequest(url, {
		method: "PUT",
		data: JSON.stringify(data),
	});
}

export function del(url: string, data = {}) {
	return makeRequest(url, {
		method: "DELETE",
		data: JSON.stringify(data),
	});
}

export function patch(url: string, data = {}) {
	return makeRequest(url, {
		method: "PATCH",
		data: JSON.stringify(data),
	});
}

export function filterize(obj: any, extended: boolean = false) {
	const newObj: any = {};

	for (const key in obj) {
		if (obj[key]) newObj["filter_" + key] = obj[key];
	}

	if (extended) newObj.extended_filters = true;

	return newObj;
}

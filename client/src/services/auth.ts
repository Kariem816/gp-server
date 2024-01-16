import { get, post, put } from "./api";

export async function registerUser(userData: object, accountType: string) {
	return post(`/users/register/${accountType}`, userData);
}

export async function loginUser(username: string, password: string) {
	return post("/users/login", { username, password });
}

export async function logoutUser() {
	return post("/users/logout");
}

export async function refreshToken() {
	return get("/users/refresh-token");
}

export async function getCurrentUser() {
	return get("/users/me");
}

export async function changePassword(oldPassword: string, newPassword: string) {
	return put("/users/password", { oldPassword, newPassword });
}

import { createContext, useContext } from "react";

import type { User, UserRole } from "~/types/users";

type AuthContextValue = {
	isLoggedIn: boolean;
	user: User;
	register: (
		userData: { name: string; username: string; password: string },
		accountType: UserRole
	) => Promise<User>;
	login: (username: string, password: string) => Promise<void>;
	refreshUser: () => Promise<void>;
	logout: () => void;
};

export const DEFAULT_USER: User = {
	role: "guest",
};

const defaultValue: AuthContextValue = {
	isLoggedIn: false,
	user: DEFAULT_USER,
	register: () => new Promise(() => {}),
	login: () => new Promise(() => {}),
	refreshUser: () => new Promise(() => {}),
	logout: () => {},
};

export const authContext = createContext<AuthContextValue>(defaultValue);

export function useAuth() {
	return useContext(authContext);
}

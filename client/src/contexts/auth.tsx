import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
} from "react";
import {
	registerUser,
	loginUser,
	logoutUser,
	refreshToken,
	getCurrentUser,
} from "~/services/auth";
import { removeAPIToken, setAPIToken } from "~/services/api";

import type { User, UserRole } from "~/types/users";

type AuthContextValue = {
	isLoggedIn: boolean;
	user: User;
	register: (userData: User, accountType: UserRole) => Promise<User>;
	login: (username: string, password: string) => Promise<void>;
	refreshUser: (newUser: User) => Promise<void>;
	logout: () => void;
};

const DEFAULT_USER: User = {
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

const authContext = createContext<AuthContextValue>(defaultValue);

export function useAuth() {
	return useContext(authContext);
}

const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 4.5; // 4.5 minutes

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<User>(DEFAULT_USER);
	const refreshTokenTimeout = useRef<NodeJS.Timeout>();
	const refreshTokenLastRefreshed = useRef<Date>();
	// TODO: handle refresh when the app comes back from background
	// const loggedInRef = useRef(false);

	// AppState
	// const appState = useRef(AppState.currentState);
	// loggedInRef.current = isLoggedIn;

	// useEffect(() => {
	// 	const subscription = AppState.addEventListener(
	// 		"change",
	// 		(nextAppState) => {
	// 			if (
	// 				appState.current.match(/inactive|background/) &&
	// 				nextAppState === "active"
	// 			) {
	// 				// check if token is expired, if so refresh it
	// 				if (
	// 					loggedInRef.current &&
	// 					refreshTokenLastRefreshed.current
	// 				) {
	// 					const now = new Date();
	// 					const diff =
	// 						now.getTime() -
	// 						refreshTokenLastRefreshed.current.getTime();
	// 					if (diff > REFRESH_TOKEN_INTERVAL) {
	// 						refreshTokenInternal();
	// 					}
	// 				}
	// 			}

	// 			appState.current = nextAppState;
	// 		}
	// 	);

	// 	return () => {
	// 		subscription.remove();
	// 	};
	// }, []);

	useEffect(() => {
		refreshTokenInternal()
			.then(() => {
				getCurrentUser().then(setUser).catch(logout);
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		// Reference comparison
		setIsLoggedIn(user !== DEFAULT_USER);
	}, [user]);

	async function register(
		userData: User,
		accountType: UserRole
	): Promise<User> {
		const user = await registerUser(userData, accountType);
		return user;
	}

	async function login(username: string, password: string) {
		const { accessToken, user } = await loginUser(username, password);

		setAPIToken(accessToken);
		setUser(user);
		startRefreshTokenTimer();
	}

	async function refreshUser() {
		stopRefreshTokenTimer();
		refreshTokenInternal();
		try {
			const newUser = await getCurrentUser();
			setUser(newUser);
		} catch (err) {
			logout();
		}
	}

	async function logout() {
		try {
			await logoutUser();
		} catch (err) {}

		removeAPIToken();
		setUser(DEFAULT_USER);
		stopRefreshTokenTimer();
	}

	async function refreshTokenInternal(startup = false) {
		try {
			const { accessToken } = await refreshToken();
			setAPIToken(accessToken);
			startRefreshTokenTimer();
		} catch (err) {
			stopRefreshTokenTimer();
			setUser(DEFAULT_USER);
			if (startup) {
				throw err;
			}
		}
	}

	function startRefreshTokenTimer() {
		refreshTokenLastRefreshed.current = new Date();
		refreshTokenTimeout.current = setTimeout(
			refreshTokenInternal,
			REFRESH_TOKEN_INTERVAL
		);
	}

	function stopRefreshTokenTimer() {
		if (refreshTokenTimeout.current) {
			clearTimeout(refreshTokenTimeout.current);
			refreshTokenTimeout.current = undefined;
		}

		if (refreshTokenLastRefreshed.current) {
			refreshTokenLastRefreshed.current = undefined;
		}
	}

	return (
		<authContext.Provider
			value={{
				isLoggedIn,
				user,
				register,
				login,
				refreshUser,
				logout,
			}}
		>
			{children}
		</authContext.Provider>
	);
}

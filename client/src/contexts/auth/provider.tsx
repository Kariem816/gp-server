import { useState, useEffect, useRef } from "react";
import {
	registerUser,
	loginUser,
	logoutUser,
	refreshToken,
	getCurrentUser,
} from "~/services/auth";
import { removeAPIToken, setAPIToken } from "~/services/api";
import { Dots } from "~/components/loaders";
import { useTranslation } from "~/contexts/translation";
import { DEFAULT_USER, authContext } from "./context";

import type { ReactNode } from "react";
import type { User, UserRole } from "~/types/users";

const REFRESH_TOKEN_INTERVAL = 1000 * 60 * 4.5; // 4.5 minutes

export default function AuthProvider({ children }: { children: ReactNode }) {
	const { t } = useTranslation();

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<User>(DEFAULT_USER);
	const [isUserKnown, setIsUserKnown] = useState(false);

	const refreshTokenTimeout = useRef<number>();
	const refreshTokenLastRefreshed = useRef<Date>();

	useEffect(() => {
		function handleBlur() {
			if (!isLoggedIn) return;
			stopRefreshTokenTimer();
		}

		function handleFocus() {
			if (!isLoggedIn) return;
			const timePassed = refreshTokenLastRefreshed.current
				? Date.now() - refreshTokenLastRefreshed.current.getTime()
				: 0;
			if (timePassed < REFRESH_TOKEN_INTERVAL) {
				startRefreshTokenTimer(REFRESH_TOKEN_INTERVAL - timePassed);
			} else {
				refreshTokenInternal();
			}
		}

		window.addEventListener("blur", handleBlur);
		window.addEventListener("focus", handleFocus);

		return () => {
			window.removeEventListener("blur", handleBlur);
			window.removeEventListener("focus", handleFocus);
		};
	}, [isLoggedIn]);

	useEffect(() => {
		refreshUser().finally(() => {
			setIsUserKnown(true);
		});
	}, []);

	useEffect(() => {
		// Reference comparison
		setIsLoggedIn(user !== DEFAULT_USER);
	}, [user]);

	async function register(
		userData: User,
		accountType: UserRole
	): Promise<User> {
		const {
			data: { user },
		} = await registerUser(userData, accountType);
		return user;
	}

	async function login(username: string, password: string) {
		const { data } = await loginUser(username, password);
		const { accessToken, user } = data;

		setAPIToken(accessToken);
		setUser(user);
		startRefreshTokenTimer();
	}

	async function refreshUser() {
		stopRefreshTokenTimer();
		try {
			await refreshTokenInternal();
			const { data } = await getCurrentUser();
			setUser(data);
		} catch (err) {
			logout();
		}
	}

	async function logout() {
		try {
			await logoutUser();
		} catch {
			// don't care if logout fails
		}

		removeAPIToken();
		setUser(DEFAULT_USER);
		stopRefreshTokenTimer();
	}

	async function refreshTokenInternal() {
		try {
			const {
				data: { accessToken },
			} = await refreshToken();
			setAPIToken(accessToken);
			startRefreshTokenTimer();
		} catch (err) {
			stopRefreshTokenTimer();
			setUser(DEFAULT_USER);
		}
	}

	function startRefreshTokenTimer(amount?: number) {
		if (amount) {
			refreshTokenTimeout.current = setTimeout(
				refreshTokenInternal,
				amount
			);
			return;
		}
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

	if (!isUserKnown) {
		return (
			<div className="h-screen grid place-items-center">
				<div className="space-y-2">
					<Dots />
					<p className="text-center">{t("loading")}</p>
				</div>
			</div>
		);
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

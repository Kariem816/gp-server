import { useRouter } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";

import type { UserRole } from "~/types/users";

type Role = UserRole | "guest";

export function useSecurePage(redirectTo: string | null, ...roles: Role[]) {
	const { user, isLoggedIn } = useAuth();
	const router = useRouter();

	redirectTo ??= "/";

	const pathname = location.pathname;

	if (!isLoggedIn) {
		if (roles.includes("guest")) {
			return;
		} else {
			return router.navigate({
				to: "/login",
				search: { redirect: pathname },
			});
		}
	}

	if (!roles.includes(user.role)) {
		return router.navigate({ to: redirectTo as any });
	}
}

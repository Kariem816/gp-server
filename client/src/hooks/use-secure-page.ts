import { useRouter } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";

import type { UserRole } from "~/types/users";

type Role = UserRole | "guest";

// TODO: save search params in initial load
export function useSecurePage(redirectTo: string | null, ...roles: Role[]) {
	const { user } = useAuth();
	const router = useRouter();

	redirectTo ??= "/";

	const pathname = location.pathname;

	if (user.role === "guest") {
		if (roles.includes("guest")) {
			return;
		} else {
			return router.navigate({
				to: "/login",
				search: { redirect: pathname },
			});
		}
	}

	if (roles.length === 0) {
		return;
	}

	if (!roles.includes(user.role)) {
		return router.navigate({ to: redirectTo as any });
	}
}

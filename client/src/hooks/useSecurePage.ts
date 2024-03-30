import { useAuth } from "~/contexts/auth";

import type { UserRole } from "~/types/users";

type Role = UserRole | "guest";

type Decision = "allow" | "deny" | "redirect";

export function useSecurePage(...roles: Role[]): Decision {
	const { user, isLoggedIn } = useAuth();

	if (roles.length === 0) {
		return isLoggedIn ? "allow" : "redirect";
	}

	if (roles.includes("guest")) {
		if (roles.includes(user.role)) {
			return "allow";
		}
		return "deny";
	}

	if (!isLoggedIn) {
		return "redirect";
	}

	if (roles.includes(user.role)) {
		return "allow";
	}

	return "deny";
}

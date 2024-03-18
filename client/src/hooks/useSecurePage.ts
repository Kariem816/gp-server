import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { UserRole } from "~/types/users";

type Role = UserRole | "guest";

export function useSecurePage(role?: Role | Role[], redirect?: string) {
	const { user, isLoggedIn } = useAuth();
	const navigate = useNavigate();
	const to = (redirect || "/login") as any;

	if (!role) {
		if (!isLoggedIn) {
			return navigate({
				to,
			});
		}
		return;
	}

	if (Array.isArray(role)) {
		if (!role.includes(user.role)) {
			return navigate({
				to,
			});
		}
		return;
	}

	if (user.role !== role) {
		return navigate({
			to,
		});
	}
}

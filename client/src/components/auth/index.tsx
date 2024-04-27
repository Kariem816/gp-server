import { useAuth } from "~/contexts/auth";
import { UserRole } from "~/types/users";

export function SignedIn({ children }: { children: React.ReactNode }) {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) return null;

	return children;
}

export function SignedOut({ children }: { children: React.ReactNode }) {
	const { isLoggedIn } = useAuth();

	if (isLoggedIn) return null;

	return children;
}

export function SignedInAs({
	children,
	role,
}: {
	children: React.ReactNode;
	role: UserRole | "guest" | (UserRole | "guest")[];
}) {
	const { isLoggedIn, user } = useAuth();

	if (!isLoggedIn) return null;

	if (Array.isArray(role) && role.includes(user.role)) {
		return children;
	} else if (user.role === role) {
		return children;
	}
}

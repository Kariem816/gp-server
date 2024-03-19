import { useAuth } from "~/contexts/auth";

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
	role: string | string[];
}) {
	const { isLoggedIn, user } = useAuth();

	if (!isLoggedIn) return null;

	if (Array.isArray(role) && role.includes(user.role)) {
		return children;
	} else if (user.role === role) {
		return children;
	}
}

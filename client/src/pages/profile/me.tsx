import { createFileRoute } from "@tanstack/react-router";
import Profile from "~/components/profile";
import { useAuth } from "~/contexts/auth";
import { useSecurePage } from "~/hooks/use-secure-page";

export const Route = createFileRoute("/profile/me")({
	component: MyProfilePage,
});

function MyProfilePage() {
	useSecurePage("/"); // wouldn't even matter because you will be redirected to login page
	const { user } = useAuth();

	if (user.role === "guest") {
		console.error(
			"Unreachable. The above hook should have redirected to login page."
		);
		return null;
	}

	return <Profile user={user} />;
}

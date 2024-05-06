import { useQuery } from "@tanstack/react-query";
import { Navigate, createFileRoute } from "@tanstack/react-router";
import Forbidden from "~/components/error/forbidden";
import { Spinner } from "~/components/loaders";
import Profile from "~/components/profile";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { getUser } from "~/services/users";

export const Route = createFileRoute("/profile/$id")({
	component: ProfilePage,
});

function ProfilePage() {
	const { id } = Route.useParams();
	const { user } = useAuth();
	const { t } = useTranslation();

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["user", id],
		queryFn: () => getUser(id),
		enabled:
			user.role === "admin" || (user.role !== "guest" && user.id === id),
	});

	if (user.role === "guest") {
		return <Navigate to="/login" search={{ redirect: "/profile/" + id }} />;
	}

	if (user.role !== "admin" && user.id !== id) {
		return (
			<div className="text-center my-20">
				<Forbidden />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{t(error.message)}</p>
			</div>
		);
	}

	if (isPending) {
		// TODO: implement skeleton loader
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return <Profile user={data.data} />;
}

import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { LoggedUser } from "~/types/users";

export const Route = createFileRoute("/students/me/")({
	component: Welcome,
	beforeLoad: () => {
		throw redirect({
			to: "/students/me/courses",
			replace: true,
		});
	},
});

function Welcome() {
	const { user } = useAuth();
	const { t } = useTranslation();

	return (
		<div className="h-full flex items-center justify-center">
			<h1 className="text-2xl font-semibold">
				{t("dash_word", (user as LoggedUser).name.split(" ")[0])}
			</h1>
		</div>
	);
}

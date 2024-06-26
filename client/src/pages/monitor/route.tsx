import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { useSecurePage } from "~/hooks/use-secure-page";
import { getMyPermissions } from "~/services/controllers";

export const Route = createFileRoute("/monitor")({
	component: MonitorLayout,
});

function MonitorLayout() {
	const { user } = useAuth();
	const { t } = useTranslation();

	const {
		data: permissions,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-permissions"],
		queryFn: () => getMyPermissions(),
		enabled: user.role === "controller",
	});

	useSecurePage("/", "admin", "controller");

	return (
		<div className="h-full flex flex-col divide-x-2 rtl:divide-x-reverse md:flex-row">
			<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>{t("monitor")}</h2>
				{isError ? (
					<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
						{error.message}
					</div>
				) : user.role !== "admin" && (isLoading || !permissions) ? (
					<div className="my-10 flex justify-center items-center">
						<Spinner />
					</div>
				) : (
					<div className="flex md:flex-col gap-2 overflow-x-auto p-2 md:p-0">
						{user.role === "admin" ||
						permissions?.data.includes("garbage") ? (
							<Link
								className="hover:underline"
								to="/monitor/garbage"
							>
								{t("garbage")}
							</Link>
						) : null}
						{user.role === "admin" ||
						permissions?.data.includes("parking") ? (
							<Link
								className="hover:underline"
								to="/monitor/parking"
							>
								{t("parking")}
							</Link>
						) : null}
						{user.role === "admin" ||
						permissions?.data.includes("irrigation") ? (
							<Link
								className="hover:underline"
								to="/monitor/irrigation"
							>
								{t("irrigation")}
							</Link>
						) : null}
						{user.role === "admin" ||
						permissions?.data.includes("lighting") ? (
							<Link
								className="hover:underline"
								to="/monitor/lighting"
							>
								{t("lighting")}
							</Link>
						) : null}
					</div>
				)}
			</div>

			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

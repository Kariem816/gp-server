import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "~/contexts/translation";
import { useSecurePage } from "~/hooks/use-secure-page";

export const Route = createFileRoute("/students/me")({
	component: Layout,
});

type NavRoute = {
	name: string;
	path: string;
	icon?: JSX.Element;
};

function generateDashboardRoutes(): NavRoute[] {
	return [
		{
			name: "courses",
			path: "/students/me/courses",
		},
		{
			name: "schedule",
			path: "/students/me/schedule",
		},
		{
			name: "attendance",
			path: "/students/me/attendance",
		},
	];
}

function Layout() {
	const { t } = useTranslation();
	useSecurePage("/", "student");

	return (
		<div className="h-full flex flex-col divide-x-2 rtl:divide-x-reverse md:flex-row">
			<div className="pt-2 md:p-4 md:w-[25%] md:h-full md:overflow-y-auto md:space-y-2 overflow-x-auto flex md:block border-b-2 md:border-none flex-shrink-0">
				{generateDashboardRoutes().map((route) => (
					<Link
						key={route.path}
						to={route.path as any}
						activeProps={{ className: "bg-primary/80 text-white" }}
						className="block p-2 md:px-4 hover:bg-primary hover:text-white md:rounded-md font-semibold"
					>
						{t(route.name)}
					</Link>
				))}
			</div>
			<div className="flex-grow py-2 md:pb-8 md:h-full overflow-y-auto">
				<Outlet />
			</div>
		</div>
	);
}

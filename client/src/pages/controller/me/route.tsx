import {
	Link,
	Navigate,
	Outlet,
	createFileRoute,
} from "@tanstack/react-router";
import Forbidden from "~/components/error/forbidden";
import { useSecurePage } from "~/hooks/useSecurePage";

export const Route = createFileRoute("/controller/me")({
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
			name: "API Keys",
			path: "/controller/me/api-keys",
		},
		{
			name: "Control Elements",
			path: "/controller/me/control-elements",
		},
	];
}

function Layout() {
	const showPage = useSecurePage("controller");
	if (showPage === "redirect") return <Navigate to="/login" replace />;
	if (showPage === "deny")
		return (
			<div className="h-full flex flex-col justify-center items-center">
				<Forbidden />
			</div>
		);

	return (
		<div className="h-full flex flex-col divide-x-2 md:flex-row">
			<div className="pt-2 md:p-4 md:w-[25%] md:h-full md:overflow-y-auto md:space-y-2 overflow-x-auto flex md:block">
				{generateDashboardRoutes().map((route) => (
					<Link
						key={route.path}
						to={route.path as any}
						activeProps={{ className: "bg-primary/80 text-white" }}
						className="block p-2 md:px-4 hover:bg-primary hover:text-white md:rounded-md font-semibold"
					>
						{route.name}
					</Link>
				))}
			</div>
			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

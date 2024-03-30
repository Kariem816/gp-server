import { Navigate, Outlet } from "@tanstack/react-router";
import Forbidden from "~/components/error/forbidden";
import { useSecurePage } from "~/hooks/useSecurePage";

export default function Layout() {
	const showPage = useSecurePage("admin");
	if (showPage === "redirect") return <Navigate to="/login" replace />;
	if (showPage === "deny")
		return (
			<div className="h-full flex flex-col justify-center items-center">
				<Forbidden />
			</div>
		);

	return (
		<div className="h-full flex flex-col divide-x-2 md:flex-row">
			<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>Dashboard</h2>
			</div>
			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

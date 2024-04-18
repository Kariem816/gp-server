import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/monitor")({
	component: MonitorLayout,
});

function MonitorLayout() {
	return (
		<div className="h-full flex flex-col divide-x-2 md:flex-row">
			<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>Monitor</h2>
				<p className="italic text-center">No controllers available</p>
			</div>
			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

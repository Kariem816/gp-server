import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/monitor")({
	component: MonitorLayout,
});

function MonitorLayout() {
	return (
		<div className="h-full flex flex-col divide-x-2 md:flex-row">
			<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>Monitor</h2>
				<div>
					<p>
						<Link className="hover:underline" to="/monitor/garbage">
							Garbage
						</Link>
					</p>
					<p>
						<Link className="hover:underline" to="/monitor/parking">
							Parking
						</Link>
					</p>
					<p>
						<Link
							className="hover:underline"
							to="/monitor/irrigation"
						>
							Irrigation
						</Link>
					</p>
					<p>
						<Link
							className="hover:underline"
							to="/monitor/attendence"
						>
							Attendence
						</Link>
					</p>
				</div>
			</div>
			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

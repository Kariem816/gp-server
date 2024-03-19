import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { get } from "~/services/api";

export const Route = createFileRoute("/monitor")({
	component: MonitorLayout,
	loader: async () => {
		const data = await get("/graph-temp");
		return data as { id: number; label: string }[];
	},
});

function MonitorLayout() {
	const controllers = Route.useLoaderData();
	return (
		<div className="h-full flex flex-col divide-x-2 md:flex-row">
			<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>Monitor</h2>
				{controllers.length === 0 ? (
					<p className="italic text-center">
						No controllers available
					</p>
				) : (
					<ul>
						{controllers.map((controller) => (
							<li key={controller.id}>
								<Link
									to={"/monitor/$id"}
									params={{ id: controller.id + "" }}
								>
									{controller.label}
								</Link>
							</li>
						))}
					</ul>
				)}
			</div>
			<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
	);
}

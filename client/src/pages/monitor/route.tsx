import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { useAuth } from "~/contexts/auth";
import { getMyPermissions } from "~/services/controllers";

export const Route = createFileRoute("/monitor")({
	component: MonitorLayout,
});

function  MonitorLayout() {
	const {user} = useAuth()

	

	const {
		data : permissions,
		isLoading,
		isError,
		error

	} = useQuery({

		queryKey : ["mypermissions" ],
		queryFn : () => getMyPermissions(),
		enabled : user.role === "controller" 

	})

	// if not admin or cont 












	return (
		
		<div className="h-full flex flex-col divide-x-2 md:flex-row">

			{isError ? (
		<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
			{error.message}
		</div>
	) : isLoading ? (
		<div className="h-full flex justify-center items-center">
			<p><Spinner /> </p>
		</div>
	)
	 :  (
		<div className="p-4 md:w-[25%] md:h-full md:overflow-auto">
				<h2>Monitor</h2>
				<div>
					{permissions.data.includes("garbage") ? <p>
						<Link className="hover:underline" to="/monitor/garbage">
							Garbage
						</Link>
					</p> : null}
					{permissions.data.includes("parking") ?  <p>
						<Link className="hover:underline" to="/monitor/parking">
							Parking
						</Link>
					</p> : null}
					{permissions.data.includes("irrigation") ? <p>
						<Link
							className="hover:underline"
							to="/monitor/irrigation"
						>
							Irrigation
						</Link>
					</p> : null}
					{permissions?.data.includes("lighting") ? <p>
						<Link
							className="hover:underline"
							to="/monitor/irrigation"
						>
							Lighting
						</Link>
					</p> :null}
				</div>
			
			
		</div>

	)}
		<div className="container py-8 md:h-full md:overflow-auto">
				<Outlet />
			</div>
		</div>
		
	);
}


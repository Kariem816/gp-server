import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import LightingCard from "../../../components/lighting/index.tsx";
import { NewLampSpot } from "~/components/lighting/new.tsx";
import { LampSpot } from "~/components/lighting/delete.tsx";

import { getAllLamps } from "~/services/lighting.ts";
import { useControllerPermission } from "~/hooks/controllers/use-controller-permission";

export const Route = createFileRoute("/monitor/lighting/")({
	component: LightingList,
});

function LightingList() {
	useControllerPermission("/", "lighting");
	const {
		data: lighting,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["lighting"],
		queryFn: () => getAllLamps(),
		select: (data) => data.data,
		refetchInterval: 3 * 1000, // 3 seconds
	});

	if (isLoading || !lighting) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error</p>;
	}

	return (
		<>
		<div>
		<div className="flex justify-end mb-2">
				<NewLampSpot />
			</div>
			{lighting.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				lighting.map((light) => (
					<div
						key={light.id}
						className="rounded-lg bg-accent p-4 space-y-4 mb-8 text-center"
					>
						<div className="flex justify-end">
							<LampSpot key={light.id} lamp={light}/>
							
						</div>
						<LightingCard
							id={light.id}
							state={light.state}
							location={light.location}
						/>
					</div>
				))
			)}
			</div>
		</>
	);
}

export default LightingList;

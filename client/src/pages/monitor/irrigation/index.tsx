import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllPlants } from "~/services/irrigation.ts";
import LoadingBar from "../../../components/loading-bar/loading-bar.tsx";
export const Route = createFileRoute("/monitor/irrigation/")({
	component: IrrigationList,
});
function IrrigationList() {
	const {
		data: irrigation,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["irrigation"],
		queryFn: () => getAllPlants(),
		select: (data) => data.data,
		refetchInterval: 3 * 1000, // 3 seconds
	});
	if (isLoading || !irrigation ) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error</p>;
	}

	return (
		<>
			{irrigation.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				irrigation.map((plant) => (
					<div className="rounded-lg bg-accent p-4 space-y-4 mb-8">
						<p className="text-center">{plant.id}</p>
						<LoadingBar value={plant.lastUpdated} />
					</div>
				))
			)}
		</>
	);
}

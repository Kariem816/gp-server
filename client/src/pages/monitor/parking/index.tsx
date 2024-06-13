import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ParkingSpotCard from "../../../components/parkingcard.tsx"; // Import the ParkingSpotCard component
import { getAllSpots } from "~/services/parking.ts";
import { useControllerPermission } from "~/hooks/controllers/use-controller-permission.ts";

export const Route = createFileRoute("/monitor/parking/")({
	component: ParkingList,
});

function ParkingList() {
	useControllerPermission("/", "parking");
	const {
		data: parking,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["parking"],
		queryFn: () => getAllSpots(),
		select: (data) => data.data,
		refetchInterval: 3 * 1000, // 3 seconds
	});

	if (isLoading || !parking) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error</p>;
	}

	return (
		<>
			{parking.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				parking.map((spot) => (
					<div
						key={spot.id}
						className="rounded-lg bg-accent p-4 space-y-4 mb-8 text-center"
					>
						<ParkingSpotCard
							id={spot.id}
							isEmpty={spot.isEmpty}
							location={spot.location}
							isSmart={spot.isSmart}
						/>
					</div>
				))
			)}
		</>
	);
}

export default ParkingList;

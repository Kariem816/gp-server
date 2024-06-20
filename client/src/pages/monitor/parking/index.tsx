import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import ParkingSpotCard from "../../../components/parking/index"; 
import { NewParkigSpot } from "~/components/parking/new.tsx";
import { getAllSpots } from "~/services/parking.ts";
import { ParkingSpo } from "~/components/parking/delete.tsx";

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
		<div>
		<div className="flex justify-end mb-2">
				<NewParkigSpot  />
			</div>
			{parking.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				parking.map((spot) => (
					<div
						key={spot.id}
						className="rounded-lg bg-accent p-4 space-y-4 mb-8 text-center"
					>
						<div className="flex justify-end">
						<ParkingSpo key={spot.id} parking={spot}/>
						</div>
						
						<ParkingSpotCard
							id={spot.id}
							isEmpty={spot.isEmpty}
							location={spot.location}
							isSmart={spot.isSmart}
						/>
					</div>
				))
			)}
			</div>
		</>
	);
}

export default ParkingList;

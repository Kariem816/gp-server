import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
// import { getAllSlots } from "../../../services/garbage.ts";

import LoadingBar from "../../../components/loading-bar/loading-bar.tsx";
import { getAllSlots } from "~/services/parking.ts";

export const Route = createFileRoute("/monitor/parking/")({
	component: ParkingList,
});


function ParkingList() {
	const {
		data: parking,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["parking"],
		queryFn: () => getAllSlots(),
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
				parking.map((slot) => (
					<div className="rounded-lg bg-accent p-4 space-y-4 mb-8">
						<p className="text-center">{slot.location}</p>
						{/* <LoadingBar value={slot.id} /> */}
					</div>
				))
			)}
		</>
	);
}

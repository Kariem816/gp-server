import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllCans } from "~/services/garbage";

import LoadingBar from "../../../components/loading-bar/loading-bar.tsx";

export const Route = createFileRoute("/monitor/garbage/")({
	component: GarbageList,
});

function GarbageList() {
	const {
		data: garbage,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["garbage"],
		queryFn: () => getAllCans(),
		select: (data) => data.data,
		refetchInterval: 3 * 1000, // 3 seconds
	});

	if (isLoading || !garbage) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error</p>;
	}

	return (
		<>
			{garbage.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				garbage.map((can) => (
					<div className="rounded-lg bg-accent p-4 space-y-4 mb-8">
						<p className="text-center">{can.location}</p>
						<LoadingBar value={can.level} />
					</div>
				))
			)}
		</>
	);
}

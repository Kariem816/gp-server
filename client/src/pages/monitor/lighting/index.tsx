import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllLamps } from "~/services/lighting.ts";

import LoadingBar from "../../../components/loading-bar/loading-bar.tsx";

export const Route = createFileRoute("/monitor/lighting/")({
	component: LightingList,
});
// import { get } from "./api";
// import type { APIQuery } from "~/types/query";
// export type LightSpot = {
//     id: string;
//     state: boolean;
//     location: string;
// }
// export async function getAllLamps(query: APIQuery = {}): Promise<PaginatedResponse<LightSpot>> {
//     return get("/lighting", query);
// }

function LightingList() {
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
			{lighting.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				lighting.map((light) => (
					<div className="rounded-lg bg-accent p-4 space-y-4 mb-8">
						<p className="text-center">{light.location}</p>
						{/* <LoadingBar value={light.level} /> */}
					</div>
				))
			)}
		</>
	);
}

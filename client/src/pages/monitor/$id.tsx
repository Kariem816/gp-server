import { createFileRoute } from "@tanstack/react-router";
import { get } from "~/services/api";
import { VictoryChart, VictoryLine, VictoryAxis } from "victory";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/monitor/$id")({
	component: MonitorPage,
	loader: async ({ params: { id } }) => {
		const data = await get(`/graph-temp/${id}`);
		return data as {
			id: number;
			label: string;
			xLabel: string;
			yLabel: string;
			data: {
				time: string; // ISO string
				value: number;
			}[];
		};
	},
});

const f = new Intl.DateTimeFormat("en-eg", {
	hour: "numeric",
	minute: "numeric",
	second: "numeric",
});

function formatData(
	data: {
		time: string;
		value: number;
	}[]
) {
	return data.map((d) => {
		const timeObj = new Date(d.time);

		return {
			...d,
			time: timeObj.getTime(),
		};
	});
}

function MonitorPage() {
	const { id, data, label, xLabel, yLabel } = Route.useLoaderData();
	const {
		data: graphData,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["graph-temp", id],
		queryFn: () => get(`/graph-temp/${id}`),
		select: (data) => formatData(data.data),
		initialData: formatData(data),
		refetchInterval: 3 * 1000, // 3 seconds
	});

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (isError) {
		return <p>Error</p>;
	}

	return (
		<>
			<h1 className="text-center">{label}</h1>
			{graphData.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				<VictoryChart>
					<VictoryAxis
						label={xLabel}
						fixLabelOverlap
						tickFormat={(
							t: ReturnType<typeof formatData>[number]["time"]
						) => f.format(new Date(t))}
						style={{
							grid: { stroke: "#a0a0a0", strokeWidth: 0.5 },
						}}
					/>
					<VictoryAxis
						dependentAxis
						label={yLabel}
						style={{
							grid: { stroke: "#a0a0a0", strokeWidth: 0.5 },
						}}
					/>
					<VictoryLine
						data={graphData}
						x="time"
						y="value"
						style={{ data: { stroke: "blue" } }}
						animate
					/>
				</VictoryChart>
			)}
		</>
	);
}

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
			time: timeObj.getTime() / 1000,
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
		refetchInterval: 3 * 1000, // 10 seconds
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
			<VictoryChart animate>
				<VictoryLine
					data={graphData}
					x="time"
					y="value"
					style={{ data: { stroke: "blue" } }}
				/>
				<VictoryAxis
					label={xLabel}
					fixLabelOverlap
					tickFormat={(
						t: ReturnType<typeof formatData>[number]["time"]
					) => f.format(new Date(t))}
				/>
				<VictoryAxis dependentAxis label={yLabel} />
			</VictoryChart>
		</>
	);
}

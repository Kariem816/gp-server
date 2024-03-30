import { createFileRoute } from "@tanstack/react-router";
import { get } from "~/services/api";
import { useQuery } from "@tanstack/react-query";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend
);

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

function formatData(
	data: {
		time: string;
		value: number;
	}[]
) {
	return data
		.map((d) => {
			const timeObj = new Date(d.time);

			return {
				...d,
				time: timeObj.getTime(),
			};
		})
		.reverse();
}

function MonitorPage() {
	const { id, data, label, yLabel } = Route.useLoaderData();
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
			{graphData.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				<Line
					data={{
						labels: graphData.map((d) =>
							new Date(d.time).toLocaleTimeString("en-US")
						),
						datasets: [
							{
								label: yLabel,
								data: graphData.map((d) => d.value),
								backgroundColor: "rgba(0, 0, 255)",
								borderColor: "rgba(0, 0, 255, 0.2)",
							},
						],
					}}
					options={{
						responsive: true,
						plugins: {
							legend: {
								position: "bottom",
							},
							title: {
								display: true,
								text: label,
							},
						},
					}}
				/>
			)}
		</>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllPlants } from "~/services/irrigation.ts";
import PlantCard from "../../../components/irrigation/index.tsx";
import { Spinner } from "~/components/loaders";
import { time } from "~/utils/formatters/time";
import { useTranslation } from "~/contexts/translation";
import { useControllerPermission } from "~/hooks/controllers/use-controller-permission.ts";
import { NewPlanetSpot } from "~/components/irrigation/new.tsx";
import { PlanetSpot } from "~/components/irrigation/delete.tsx";

export const Route = createFileRoute("/monitor/irrigation/")({
	component: IrrigationList,
});
function IrrigationList() {
	useControllerPermission("/", "irrigation");
	const { t } = useTranslation();
	const {
		data: irrigation,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["irrigation"],
		queryFn: () => getAllPlants(),
		select: (data) => data.data,
		refetchInterval: 3 * 1000, // 3 seconds
	});


	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}
	if (isLoading || !irrigation) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<>
		<div>
			<div className="flex justify-end mb-2">
				<NewPlanetSpot />
			</div>
			{irrigation.length === 0 ? (
				<p className="italic text-center">No data available</p>
			) : (
				irrigation.map((plant) => (
					
						<div
						
						key={plant.id}
						className="rounded-lg bg-accent p-4 space-y-4 mb-8"
					>
						<div className="flex justify-end">
							<PlanetSpot key={plant.id} plant={plant}/>
							
						</div>
	
						<PlantCard
							id={plant.id}
							lastUpdate={time(plant.lastUpdated)}
							isWatering={plant.isWatering}
							plantType={plant.type}
						/>
					</div>
					
				))
			)}
			</div>
		</>
	);
}

export default IrrigationList;

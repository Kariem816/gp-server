import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllPlants } from "~/services/irrigation.ts";
import PlantCard from "../../../components/plantcard.tsx"
 import {time} from "~/utils/formatters/time"
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
			  <div key={plant.id} className="rounded-lg bg-accent p-4 space-y-4 mb-8">
				<PlantCard
					id = {plant.id}
				  lastUpdate={ time(plant.lastUpdated)}
				  isWatering={plant.isWatering}
				  plantType={plant.type}
				/>
			  </div>
			))
		  )}
		</>
	  );
	}
	
	export default IrrigationList;

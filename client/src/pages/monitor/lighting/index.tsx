import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import LightingCard from "../../../components/lightcard"; 
import { getAllLamps } from "~/services/lighting.ts";

export const Route = createFileRoute("/monitor/lighting/")({
  component: LightingList,
});

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
          <div key={light.id} className="rounded-lg bg-accent p-4 space-y-4 mb-8 text-center">
            <LightingCard
              id={light.id}
              state={light.state}
              location={light.location}
            />
          </div>
        ))
      )}
    </>
  );
}

export default LightingList;

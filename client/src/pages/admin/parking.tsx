import { UpdateIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { SelectorCanvas } from "~/components/smart-parking/canvas";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { getParkingOverview, getSmartSpots } from "~/services/parking";
import { cn } from "~/utils";

export const Route = createFileRoute("/admin/parking")({
	component: ParkingConfigPage,
});

function ParkingConfigPage() {
	const { t } = useTranslation();

	const { data, isPending, isError, error, refetch, isRefetching } = useQuery(
		{
			queryKey: ["parking-camera"],
			queryFn: getParkingOverview,
			select: (data) => data.data,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
		}
	);

	const { data: spots, refetch: refetchSpots } = useQuery({
		queryKey: ["parking-spots"],
		queryFn: getSmartSpots,
		select: (data) => data.data,
	});

	function handleRefetch() {
		Promise.all([refetch(), refetchSpots()]);
	}

	return (
		<div className="p-4">
			<div className="flex justify-between items-center">
				<h1 className="m-0">{t("parking_config")}</h1>
				<Button variant="ghost" size="icon" onClick={handleRefetch}>
					<UpdateIcon
						className={cn(
							"text-primary",
							isRefetching && "animate-spin"
						)}
					/>
				</Button>
			</div>
			{isError ? (
				<h2 className="text-destructive">{error.message}</h2>
			) : isPending || !data ? (
				<div className="flex justify-center py-8">
					<Spinner />
				</div>
			) : (
				<SelectorCanvas bg={data.img} initialSpots={spots ?? []} />
			)}
		</div>
	);
}

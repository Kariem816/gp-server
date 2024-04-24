import { UpdateIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { SelectorCanvas } from "~/components/parking-config/canvas";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { getParkingOverview } from "~/services/admin";
import { cn } from "~/utils";

export const Route = createFileRoute("/admin/camera")({
	component: CameraConfigPage,
});

function CameraConfigPage() {
	const { t } = useTranslation();

	const { data, isPending, isError, error, refetch, isRefetching } = useQuery(
		{
			queryKey: ["parking-camera"],
			queryFn: getParkingOverview,
			select: (data) => data.data,
		}
	);

	return (
		<div className="p-4">
			<div className="flex justify-between items-center">
				<h1 className="m-0">{t("parking_config")}</h1>
				<Button variant="ghost" size="icon" onClick={() => refetch()}>
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
				<SelectorCanvas bg={data.img} />
			)}
		</div>
	);
}

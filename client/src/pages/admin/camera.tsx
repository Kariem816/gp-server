import { UpdateIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { getCameras } from "~/services/camera";
import { cn } from "~/utils";
import { NewCamera } from "~/components/camera/new";
import { Camera } from "~/components/camera";

export const Route = createFileRoute("/admin/camera")({
	component: CameraPage,
});

function CameraPage() {
	const { t } = useTranslation();
	const {
		data: cameras,
		isLoading,
		isError,
		error,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["cameras"],
		queryFn: () => getCameras(),
		select: (data) => data.data,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !cameras) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			<div className="flex justify-end gap-4">
				<Button variant="outline" size="icon" onClick={() => refetch()}>
					<UpdateIcon
						className={cn(isRefetching && "animate-spin")}
					/>
				</Button>
				<NewCamera />
			</div>
			{cameras.length === 0 ? (
				<p className="italic text-center">{t("no_cameras")}</p>
			) : (
				<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					{cameras.map((camera) => (
						<Camera key={camera.id} camera={camera} />
					))}
				</div>
			)}
		</div>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getAllCans } from "~/services/garbage";

import { useControllerPermission } from "~/hooks/controllers/use-controller-permission.ts";
import { Spinner } from "~/components/loaders";
import { useTranslation } from "~/contexts/translation";
import { GarbageCan } from "~/components/garbage";
import { NewGarbageCan } from "~/components/garbage/new";

export const Route = createFileRoute("/monitor/garbage/")({
	component: GarbageList,
});

function GarbageList() {
	useControllerPermission("/", "garbage");
	const { t } = useTranslation();

	const {
		data: garbage,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["garbage"],
		queryFn: () => getAllCans(),
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

	if (isLoading || !garbage) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="flex justify-end">
				<NewGarbageCan />
			</div>
			{garbage.length === 0 ? (
				<p className="italic text-center">{t("no_cans")}</p>
			) : (
				<div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
					{garbage.map((can) => (
						<GarbageCan key={can.id} can={can} />
					))}
				</div>
			)}
		</div>
	);
}

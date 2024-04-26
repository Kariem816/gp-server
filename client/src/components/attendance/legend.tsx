import { useTranslation } from "~/contexts/translation";

export function Legend({
	attended = false,
	absent = false,
	catched = false,
	uncatched = false,
}: {
	attended?: boolean;
	absent?: boolean;
	catched?: boolean;
	uncatched?: boolean;
}) {
	const { t } = useTranslation();
	return (
		<div className="flex justify-center gap-4 p-2">
			{attended && (
				<div className="flex items-center gap-2">
					<div className="size-4 bg-gray-200"></div>
					<p className="text-sm">{t("attended")}</p>
				</div>
			)}
			{absent && (
				<div className="flex items-center gap-2">
					<div className="size-4 border"></div>
					<p className="text-sm">{t("absent")}</p>
				</div>
			)}
			{catched && (
				<div className="flex items-center gap-2">
					<div className="size-4 bg-green-500"></div>
					<p className="text-sm">{t("catched")}</p>
				</div>
			)}
			{uncatched && (
				<div className="flex items-center gap-2">
					<div className="size-4 bg-red-500"></div>
					<p className="text-sm">{t("uncatched")}</p>
				</div>
			)}
		</div>
	);
}

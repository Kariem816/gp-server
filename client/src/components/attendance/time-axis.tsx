import { time as formatTime } from "~/utils/formatters/time";
import { cn } from "~/utils";
import { useTranslation } from "~/contexts/translation";

export function TimeAxis({ start, end }: { start: Date; end: Date }) {
	const { t, language, isRTL } = useTranslation();

	return (
		<div className="flex justify-between text-xs">
			<div className={cn(isRTL ? "translate-x-1/2" : "-translate-x-1/2")}>
				<p className="bg-white ">{formatTime(start, language)}</p>
			</div>
			<p className="font-semibold py-2">{t("Time")}</p>
			<div className={cn(isRTL ? "-translate-x-1/2" : "translate-x-1/2")}>
				<p className="bg-white">{formatTime(end, language)}</p>
			</div>
		</div>
	);
}

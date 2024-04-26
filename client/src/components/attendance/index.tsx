import { useTranslation } from "~/contexts/translation";
import { AttendanceGraph } from "./graph";

export type AttendanceTimeline = {
	start: Date;
	end: Date;
	imgs: Date[];
};

export function AttendanceSummary({
	times,
	timeline,
	percentage,
	periods,
}: {
	times: Date[];
	timeline: AttendanceTimeline;
	percentage: number;
	periods: { start: Date; end: Date }[];
}) {
	const { t } = useTranslation();

	return (
		<div className="flex-grow">
			{times.length > 0 ? (
				<AttendanceGraph
					times={times}
					periods={periods}
					timeline={timeline}
					percentage={percentage}
				/>
			) : (
				<p className="text-sm italic font-semibold text-center">
					{t("manual_attendance")}
				</p>
			)}
		</div>
	);
}

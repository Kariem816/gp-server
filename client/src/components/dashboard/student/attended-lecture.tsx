import { useMemo } from "react";
import { useTranslation } from "~/contexts/translation";
import { calculateAttendance } from "~/helpers/attendance";
import {
	time as formatTime,
	date as formatDate,
} from "~/utils/formatters/time";
import { AttendanceSummary } from "~/components/attendance";

import type { TStudentAttendance } from "~/services/students";

type TAttendanceTimes =
	TStudentAttendance[number]["attendance"][number]["times"];
type TAttendanceLecture =
	TStudentAttendance[number]["attendance"][number]["lecture"];

export function AttendedLecture({
	times,
	lecture,
}: {
	times: TAttendanceTimes;
	lecture: TAttendanceLecture;
}) {
	const { t, language } = useTranslation();
	const timeline = useMemo(() => {
		const imgs = lecture.imgs.map((img) => new Date(img.capturedAt));

		const start = new Date(lecture.time);
		const end = lecture.ended
			? new Date(lecture.ended)
			: new Date(start.getTime() + lecture.duration * 60 * 1000);

		return {
			start,
			end,
			imgs,
		};
	}, [lecture]);

	const attendance = useMemo(() => {
		return calculateAttendance(
			timeline.start,
			timeline.end,
			times.map((t) => new Date(t))
		);
	}, [times, timeline]);

	return (
		<div className="flex flex-col sm:flex-row gap-4 rounded-md border-2 p-4 shadow sm:items-center">
			<div className="flex-grow flex gap-4">
				<div className="text-end font-semibold">
					<p>{t("Time")}</p>
					<p>&nbsp;</p>
					<p>{t("duration")}</p>
					<p>{t("location")}</p>
					<p>{t("attended")}</p>
				</div>
				<div>
					<p>{formatDate(lecture.time, language)}</p>
					<p>{formatTime(lecture.time, language)}</p>
					<p>
						{lecture.duration} {t("mins")}
					</p>
					<p>{lecture.location}</p>
					<p className="italic">
						{times.length === 0
							? "100%"
							: attendance.percentage.toFixed(2) + "%"}
					</p>
				</div>
			</div>
			<AttendanceSummary
				times={times.map((t) => new Date(t))}
				timeline={timeline}
				percentage={attendance.percentage}
				periods={attendance.periods}
			/>
		</div>
	);
}

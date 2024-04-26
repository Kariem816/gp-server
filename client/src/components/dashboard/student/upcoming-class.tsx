import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { TScheduleClass } from "~/services/students";
import { dateTime, relative } from "~/utils/formatters/time";

export function UpcomingClass({ upcoming }: { upcoming: TScheduleClass }) {
	const { language, t } = useTranslation();

	return (
		<div className="border-2 border-primary rounded-xl p-4 space-y-2">
			<h4 className="text-xl font-semibold">{upcoming.course.name}</h4>
			<p className="text-primary">{upcoming.course.code}</p>
			<div className="flex justify-between items-center flex-wrap gap-4">
				<span>{dateTime(upcoming.time, language)}</span>
				<span>{relative(upcoming.time, language)}</span>
			</div>
			<p className="font-semibold">
				{upcoming.location} ({upcoming.duration} {t("mins")})
			</p>
			<div className="flex justify-end items-center gap-2">
				<Link to="/courses/$id" params={{ id: upcoming.courseId }}>
					<Button>{t("view_course")}</Button>
				</Link>
			</div>
		</div>
	);
}

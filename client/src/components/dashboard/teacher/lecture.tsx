import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { TeacherLecture } from "~/services/teachers";
import { dateTime, relative } from "~/utils/formatters/time";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import {
	DeleteLectureModal,
	EditLectureModal,
	FinishLectureModal,
} from "./lecture-modals";

export function Lecture({
	id,
	course,
	time,
	duration,
	location,
	ended,
	_count,
}: TeacherLecture) {
	const { language, t } = useTranslation();

	const { endTime, duration: actualDuration } = useMemo(() => {
		if (ended) {
			const endTime = new Date(ended);
			const actualDuration = Math.ceil(
				(endTime.getTime() - new Date(time).getTime()) / 60000
			);
			return { endTime, duration: actualDuration };
		}

		const endTime = new Date(time);
		endTime.setMinutes(endTime.getMinutes() + duration);

		if (endTime < new Date()) {
			return {
				endTime,
				duration: Math.ceil(
					(endTime.getTime() - new Date(time).getTime()) / 60000
				),
			};
		} else {
			return { endTime: null, duration };
		}
	}, [time, duration, ended]);

	return (
		<div className="border-2 border-primary rounded-xl p-4">
			<h4 className="font-semibold text-xl">
				<Link
					to="/courses/$id"
					params={{ id }}
					className="hover:underline"
				>
					{course.name}
				</Link>
			</h4>
			<p className="text-primary">{course.code}</p>
			<div className="flex flex-col xs:flex-row justify-between xs:items-center flex-wrap p-2 bg-muted rounded-lg my-2">
				<p>{dateTime(time, language)}</p>
				{endTime ? (
					<>
						<span className="flex-grow flex justify-center">
							<ArrowRightIcon />
						</span>
						<p className="text-destructive text-right">
							{dateTime(endTime, language)}
						</p>
					</>
				) : Date.parse(time) < Date.now() ? (
					<span className="flex-grow flex justify-end">
						<FinishLectureModal
							id={id}
							disabled={Date.now() < new Date(time).valueOf()}
						/>
					</span>
				) : (
					<span className="flex-grow flex justify-end">
						{relative(time, language)}
					</span>
				)}
			</div>

			<div className="flex gap-4">
				<span>
					{duration} {t("mins")}
				</span>
				{endTime && actualDuration !== duration && (
					<span className="font-semibold">
						({actualDuration} {t("mins")})
					</span>
				)}
			</div>
			<p className="font-semibold">{t(location)}</p>

			{endTime ? (
				<p>{t("n_attendees", _count.attendees.toString())}</p>
			) : null}

			<div className="flex justify-end items-center gap-2">
				<EditLectureModal
					id={id}
					initialData={{
						time: new Date(time),
						duration,
						location,
					}}
					disabled={Date.now() > new Date(time).valueOf()}
					courseId={course.id}
				/>
				<DeleteLectureModal id={id} courseId={course.id} />
				<Link to="/lectures/$id" params={{ id }}>
					<Button variant="outline">{t("details")}</Button>
				</Link>
			</div>
		</div>
	);
}

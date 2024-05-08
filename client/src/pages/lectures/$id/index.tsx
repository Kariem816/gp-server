import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	DeleteLectureModal,
	EditLectureModal,
} from "~/components/dashboard/teacher/lecture-modals";
import { Spinner } from "~/components/loaders";
import { useTranslation } from "~/contexts/translation";
import useLectureTime from "~/hooks/lectures/use-lecture-time";
import { getLecture } from "~/services/lectures";
import { dateTime, relative } from "~/utils/formatters/time";

export const Route = createFileRoute("/lectures/$id/")({
	component: LectureGeneral,
});

function LectureGeneral() {
	const { id: lectureId } = Route.useParams();
	const { t, language } = useTranslation();

	const {
		data: lecture,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["lecture", lectureId],
		queryFn: () => getLecture(lectureId),
		select: (data) => data.data,
	});

	const navigate = useNavigate();
	const { endTime, timing } = useLectureTime(lecture);

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !lecture) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="container flex items-end gap-2 my-4	">
				<h2 className="m-0">{t("lecture_info")}</h2>
				<span>
					(
					{timing === -1
						? relative(lecture.time, language)
						: timing === 0
							? t("active")
							: t("ended")}
					)
				</span>
			</div>

			<hr />

			<div className="container space-y-2">
				<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
					<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-40">
						{t("course")}
					</h4>
					<span className="text-lg font-semibold xs:flex-grow">
						{lecture.course.name}
					</span>
				</div>
				<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
					<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-40">
						{t("location")}
					</h4>
					<span className="xs:flex-grow">{lecture.location}</span>
				</div>
				<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
					<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-40">
						{t("time")}
					</h4>
					<span className="xs:flex-grow">
						{dateTime(lecture.time, language)}
					</span>
				</div>
				<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
					<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-40">
						{t("duration")}
					</h4>
					<span className="xs:flex-grow">
						{lecture.duration} {t("mins")}
					</span>
				</div>
				<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
					<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-40">
						{t("endtime")}{" "}
						{timing < 1 && (
							<span className="text-sm">({t("expected")})</span>
						)}
					</h4>
					<span className="xs:flex-grow ">
						{dateTime(endTime!, language)}
					</span>
				</div>

				{timing === 1 && (
					<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
						<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-40">
							{t("attendance")}
						</h4>
						<span className="xs:flex-grow">
							{lecture._count.attendees}
						</span>
					</div>
				)}

				<div className="flex justify-end items-center gap-2">
					<EditLectureModal
						id={lecture.id}
						initialData={{
							time: new Date(lecture.time),
							duration: lecture.duration,
							location: lecture.location,
						}}
						disabled={Date.now() > new Date(lecture.time).valueOf()}
						courseId={lecture.courseId}
					/>
					<DeleteLectureModal
						id={lecture.id}
						courseId={lecture.courseId}
						onDelete={() =>
							navigate({
								to: "/courses/$id",
								params: { id: lectureId },
							})
						}
					/>
				</div>
			</div>
		</div>
	);
}

import { useTranslation } from "~/contexts/translation";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { CourseLecture, getCourseLectures } from "~/services/courses";
import { Spinner } from "~/components/loaders";
import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { dateTime, relative } from "~/utils/formatters/time";
import {
	DeleteLectureModal,
	EditLectureModal,
} from "~/components/dashboard/teacher/lecture-modals";
import { PlusIcon } from "@radix-ui/react-icons";

export function CourseLectures({ courseId }: { courseId: string }) {
	const { t } = useTranslation();
	const {
		data: lectures,
		isLoading,
		isError,
		error,
		total,
	} = usePaginatedQuery({
		queryKey: ["course-lectures", courseId],
		queryFn: (pagination) => getCourseLectures(courseId, pagination),
		options: {
			initialLimit: 5,
			initialPage: 1,
		},
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !lectures) {
		return (
			<div className="my-12 grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-4 py-2">
			{lectures.map((lecture) => (
				<Lecture key={lecture.id} lecture={lecture} />
			))}

			{lectures.length === 0 && (
				<p className="text-center italic">{t("no_lectures")}</p>
			)}

			{total > 5 && (
				<div className="flex justify-end">
					<Link to="/courses/$id/lectures" params={{ id: courseId }}>
						<Button variant="outline">
							<PlusIcon className="me-2 size-4" />
							{t("all")}
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}

function Lecture({ lecture }: { lecture: CourseLecture }) {
	const { language, t } = useTranslation();

	return (
		<div className="rounded-xl p-4 bg-accent">
			<div className="flex flex-col xs:flex-row justify-between xs:items-center flex-wrap p-2 bg-white border rounded-lg my-2">
				<p>{dateTime(lecture.time, language)}</p>

				<span className="flex-grow flex justify-end">
					{relative(lecture.time, language)}
				</span>
			</div>

			<div className="flex gap-4">
				<span>
					{lecture.duration} {t("mins")}
				</span>
			</div>
			<p className="font-semibold">{t(lecture.location)}</p>

			{lecture.ended ? (
				<p>{t("n_attendees", lecture._count.attendees.toString())}</p>
			) : null}

			<div className="flex justify-end items-center gap-2">
				<EditLectureModal
					id={lecture.id}
					initialData={{
						time: new Date(lecture.time),
						duration: lecture.duration,
						location: lecture.location,
					}}
					disabled={Date.now() > new Date(lecture.time).valueOf()}
				/>
				<DeleteLectureModal id={lecture.id} />
				<Link to="/lectures/$id" params={{ id: lecture.id }}>
					<Button variant="outline">{t("details")}</Button>
				</Link>
			</div>
		</div>
	);
}

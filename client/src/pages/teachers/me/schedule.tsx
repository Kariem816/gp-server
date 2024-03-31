import { useTranslation } from "~/contexts/translation";
import { getMyLectures } from "~/services/teachers";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { Lecture } from "~/components/dashboard/teacher";

export const Route = createFileRoute("/teachers/me/schedule")({
	component: TeacherSchedule,
});

function TeacherSchedule() {
	const { t } = useTranslation();

	const {
		data: lectures,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["teacher-lectures"],
		queryFn: () => getMyLectures(),
		select: (data) => data.data,
		staleTime: 1000 * 60,
	});

	if (isError) {
		return (
			<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
				{error.message}
			</div>
		);
	}

	return (
		<div className="h-full">
			{isLoading || !lectures ? (
				<div className="flex justify-center items-center">
					<Spinner />
				</div>
			) : lectures.length > 0 ? (
				<ul className="overflow-y-auto max-h-full p-2">
					{lectures.map((item) => (
						<li key={item.id}>
							<Lecture {...item} />
						</li>
					))}
				</ul>
			) : (
				<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
					{t("no_lectures")}
				</div>
			)}
		</div>
	);
}

import { useTranslation } from "~/contexts/translation";
import { getMyCourses } from "~/services/teachers";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { Course } from "~/components/dashboard/teacher";

export const Route = createFileRoute("/teachers/me/courses")({
	component: MyCourses,
});

function MyCourses() {
	const { t } = useTranslation();

	const {
		data: courses,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-courses"],
		queryFn: () => getMyCourses(),
		select: (data) => data?.data ?? [],
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
			{isLoading || !courses ? (
				<div className="flex justify-center items-center">
					<Spinner />
				</div>
			) : courses.length > 0 ? (
				<ul className="overflow-y-auto p-2">
					{courses.map((course) => (
						<li key={course.id}>
							<Course {...course} />
						</li>
					))}
				</ul>
			) : (
				<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
					{t("no_courses")}
				</div>
			)}
		</div>
	);
}

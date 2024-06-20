import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Course } from "~/components/courses/course";
import { Spinner } from "~/components/loaders";
import { useTranslation } from "~/contexts/translation";
import { getCourse } from "~/services/courses";
import { cn } from "~/utils";

export const Route = createFileRoute("/courses/$id/")({
	component: CoursePage,
});

function CoursePage() {
	const { id } = Route.useParams();
	const { t, isRTL } = useTranslation();
	const {
		data: course,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["course", id],
		queryFn: () => getCourse(id),
		select: (data) => data.data,
		staleTime: 1000 * 60,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !course) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<div className="mt-4 container text-primary">
				<Link to="/courses" className="inline-block">
					<span className="flex gap-2 items-center hover:border-b border-primary">
						<ArrowLeftIcon className={cn(isRTL && "rotate-180")} />
						{t("back_courses")}
					</span>
				</Link>
			</div>
			<Course course={course} />
		</>
	);
}

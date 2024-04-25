import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Course } from "~/components/dashboard/student/course";
import { Spinner } from "~/components/loaders";
import { Obsevable } from "~/components/observable";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useTranslation } from "~/contexts/translation";
import { getMyCourses } from "~/services/students";

export const Route = createFileRoute("/students/me/courses")({
	component: MyCourses,
});

function MyCourses() {
	const { t } = useTranslation();
	const [semester, setSemester] = useState("");

	const {
		data: courses,
		hasNextPage,
		fetchNextPage,
		isLoading,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: ["student-courses", semester],
		queryFn: ({ pageParam }) => getMyCourses({ semester }, pageParam),
		select: (data) => data.pages.flatMap((page) => page.data),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			const have = lastPage.data.length;
			return have < lastPage.total ? lastPage.page + 1 : undefined;
		},
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="p-4 space-y-4">
			<div className="flex justify-end">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline">
							{t(
								"showing_courses_semester",
								semester
									? semester === "this"
										? "curr_semester"
										: semester
									: "all_semesters"
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onSelect={() => setSemester("")}>
							{t("all_semesters")}
						</DropdownMenuItem>
						<DropdownMenuItem onSelect={() => setSemester("this")}>
							{t("curr_semester")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			{isLoading || !courses ? (
				<div className="h-full grid place-items-center">
					<Spinner />
				</div>
			) : courses.length > 0 ? (
				<>
					{courses.map((course) => (
						<Course key={course.course.id} course={course} />
					))}
					{hasNextPage && (
						<Obsevable onAppearance={() => fetchNextPage()} />
					)}
				</>
			) : (
				<p className="text-center opacity-75 italic">
					{t("no_courses")}
				</p>
			)}
		</div>
	);
}

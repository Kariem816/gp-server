import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CourseListing } from "~/components/courses/course-listing";
import { Input } from "~/components/ui/input";
import useDebounce from "~/hooks/use-debounce";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getCourses } from "~/services/courses";
import { filterize } from "~/utils";

export const Route = createFileRoute("/courses/")({
	component: CoursesList,
});

function CoursesList() {
	const [filters, setFilters] = useState({
		name: "",
	});
	const debouncedFilters = useDebounce(filters, 1000);
	const {
		data: courses,
		isPending,
		isError,
		error,
		page,
		pages,
		// setPage,
	} = usePaginatedQuery({
		queryKey: ["courses", debouncedFilters.name],
		queryFn: (pagination) =>
			getCourses({
				...pagination,
				...filterize(debouncedFilters, true),
			}),
		options: {
			initialPage: 1,
			initialLimit: 20,
		},
	});

	return (
		<div className="container flex flex-col h-full">
			<div className="flex items-center justify-between flex-wrap">
				<h1>Courses</h1>
				<div className="flex items-center gap-2">
					<span className="text-nowrap">
						Page {page} of {pages}
					</span>
					<Input
						placeholder="Search by name"
						value={filters.name}
						onChange={(e) =>
							setFilters((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
					/>
				</div>
			</div>
			<div className="flex-grow overflow-auto pe-1 md:pe-2 mb-2">
				{isError ? (
					<div className="text-destructive italic font-semibold">
						{error.message}
					</div>
				) : isPending ? (
					<div className="h-full flex justify-center items-center">
						<div className="loader" />
					</div>
				) : (
					<ul>
						{courses.map((course) => (
							<li key={course.id}>
								<CourseListing {...course} />
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}

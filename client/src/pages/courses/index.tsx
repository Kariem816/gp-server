import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CourseListing } from "~/components/courses/course-listing";
import { Spinner } from "~/components/loaders";
import { Pagination } from "~/components/pagination";
import { Input } from "~/components/ui/input";
import useDebounce from "~/hooks/use-debounce";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getCourses } from "~/services/courses";
import { cn, filterize } from "~/utils";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

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
		refetch,
		isRefetching,
		isPending,
		isError,
		error,
		page,
		pages,
		setPage,
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
			<div className="flex flex-col justify-center border-b-2">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex gap-2 items-center">
						<h1 className="my-1">Courses</h1>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => refetch()}
						>
							<UpdateIcon
								className={cn(
									"text-primary",
									isRefetching && "animate-spin"
								)}
							/>
						</Button>
					</div>
					<div className="flex flex-grow xs:flex-grow-0 mb-2 xs:mb-0">
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
				<div className="mb-2">
					<Pagination page={page} pages={pages} onChange={setPage} />
				</div>
			</div>
			<div className="flex-grow overflow-auto pe-1 md:pe-2 my-2">
				{isError ? (
					<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
						{error.message}
					</div>
				) : isPending ? (
					<div className="h-full flex justify-center items-center">
						<Spinner />
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

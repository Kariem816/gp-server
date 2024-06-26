import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChangeEvent, useState } from "react";
import { CourseListing } from "~/components/courses/course-listing";
import { Spinner } from "~/components/loaders";
import { Pagination } from "~/components/pagination";
import { Input } from "~/components/ui/input";
import useDebounce from "~/hooks/use-debounce";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getCourses } from "~/services/courses";
import { cn, filterize } from "~/utils";
import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { SignedInAs } from "~/components/auth";
import { useSecurePage } from "~/hooks/use-secure-page";

import type { SearchSchemaInput } from "@tanstack/react-router";
import { useTranslation } from "~/contexts/translation";

export const Route = createFileRoute("/courses/")({
	component: CoursesList,
	validateSearch: (
		search: { page?: string; search?: string } & SearchSchemaInput
	) => ({
		page: search.page ? Number(search.page) : 1,
		search: search.search ?? "",
	}),
});

function CoursesList() {
	const { page: initialPage, search: initialSearch } = Route.useSearch();
	const { t } = useTranslation();

	const [filters, setFilters] = useState({
		name: initialSearch,
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
			initialPage,
			initialLimit: 20,
		},
	});
	useSecurePage("/");
	const navigate = useNavigate({ from: Route.fullPath });

	function updatePage(page: number) {
		setPage(page);
		navigate({
			search: (prev) => ({ ...prev, page: page.toString() }),
		});
	}

	function handleSearch(e: ChangeEvent<HTMLInputElement>) {
		const search = e.target.value;

		setFilters((prev) => ({
			...prev,
			name: search,
		}));
		setPage(1);
		navigate({
			search: () => ({ page: "1", search }),
		});
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col justify-center border-b-2 py-4 container">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex gap-2 items-end">
						<h1 className="my-1">{t("courses")}</h1>
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
						<SignedInAs role="admin">
							<Link to="/courses/new">
								<Button variant="ghost" size="icon">
									<PlusIcon className="text-primary" />
								</Button>
							</Link>
						</SignedInAs>
					</div>
					<div className="flex flex-grow xs:flex-grow-0 mb-2 xs:mb-0">
						<Input
							placeholder={t("search_name")}
							value={filters.name}
							onChange={handleSearch}
						/>
					</div>
				</div>
				<div>
					<Pagination
						page={page}
						pages={pages}
						onChange={updatePage}
					/>
				</div>
			</div>
			<div className="flex-grow overflow-auto p-2">
				{isError ? (
					<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
						{error.message}
					</div>
				) : isPending ? (
					<div className="h-full flex justify-center items-center">
						<Spinner />
					</div>
				) : courses.length === 0 ? (
					<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
						No courses found
					</div>
				) : (
					<div className="space-y-2">
						{courses.map((course) => (
							<CourseListing {...course} key={course.id} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

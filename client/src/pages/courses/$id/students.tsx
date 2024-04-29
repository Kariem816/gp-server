import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import useDebounce from "~/hooks/use-debounce";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getCourseStudents } from "~/services/courses";

import type { SearchSchemaInput } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import { Pagination } from "~/components/pagination";
import { Spinner } from "~/components/loaders";
import { cn } from "~/utils";
import { useTranslation } from "~/contexts/translation";
import { StudentRegistration } from "~/components/courses/course-students";
import { SignedInAs } from "~/components/auth";
import { useSecurePage } from "~/hooks/use-secure-page";

export const Route = createFileRoute("/courses/$id/students")({
	component: CourseStudents,
	validateSearch: (search: { page?: string } & SearchSchemaInput) => ({
		page: search.page ? Number(search.page) : 1,
	}),
});

function CourseStudents() {
	const { id } = Route.useParams();
	const { page: initialPage } = Route.useSearch();
	const { t } = useTranslation();

	useSecurePage("/courses/" + id, "admin", "teacher");

	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search);

	const {
		data: students,
		isPending,
		isError,
		error,
		isRefetching,
		refetch,
		page,
		pages,
		setPage,
	} = usePaginatedQuery({
		queryKey: ["course-students", id, debouncedSearch],
		queryFn: (pagination) =>
			getCourseStudents(id, { ...pagination, search }),
		options: {
			initialPage,
			initialLimit: 24,
		},
	});
	const navigate = useNavigate({ from: Route.fullPath });

	function updatePage(page: number) {
		setPage(page);
		navigate({
			search: { page: page.toString() },
		});
	}

	const courseName = useMemo(() => {
		if (!students?.[0]) {
			return "";
		}
		const registrations = students[0].student.registerations;

		const name = registrations.find((r) => r.course.id === id)!.course.name;

		return name + " ";
	}, [students, id]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col justify-center border-b-2 py-4 container">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex gap-2 items-end">
						<h1 className="my-1">
							{courseName}
							{t("students")}
						</h1>
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
							{/* TODO: Manually add or remove students */}
							Someday
						</SignedInAs>
					</div>
					<div className="flex flex-grow xs:flex-grow-0 mb-2 xs:mb-0">
						<Input
							placeholder={t("search_name")}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
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
				) : students.length === 0 ? (
					<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
						{t("no_students")}
					</div>
				) : (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{students.map((student) => (
							<StudentRegistration
								key={student.id}
								registration={student}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

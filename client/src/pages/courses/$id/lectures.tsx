import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import useDebounce from "~/hooks/use-debounce";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getCourseLectures, getCourseStudents } from "~/services/courses";

import type { SearchSchemaInput } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import { Pagination } from "~/components/pagination";
import { Spinner } from "~/components/loaders";
import { cn } from "~/utils";
import { useTranslation } from "~/contexts/translation";
import { StudentRegistration } from "~/components/courses/course-students";
import { useSecurePage } from "~/hooks/use-secure-page";
import { Label } from "~/components/ui/label";
import { Lecture } from "~/components/courses/course-lectures";

export const Route = createFileRoute("/courses/$id/lectures")({
	component: CourseLectures,
	validateSearch: (search: { page?: string } & SearchSchemaInput) => ({
		page: search.page ? Number(search.page) : 1,
	}),
});

function formatDate(date: Date | undefined) {
	if (!date) return "";
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

function CourseLectures() {
	const { id } = Route.useParams();
	const { page: initialPage } = Route.useSearch();
	const { t } = useTranslation();

	useSecurePage("/courses/" + id, "admin", "teacher");

	const [from, setFrom] = useState<Date | undefined>();
	const [to, setTo] = useState<Date | undefined>();

	const {
		data: lectures,
		isPending,
		isError,
		error,
		isRefetching,
		refetch,
		page,
		pages,
		setPage,
	} = usePaginatedQuery({
		queryKey: [
			"course-students",
			id,
			from?.toString() ?? "no-from",
			to?.toString() ?? "no-to",
		],
		queryFn: (pagination) =>
			getCourseLectures(id, {
				...pagination,
				from: from?.toString(),
				to: to?.toString(),
			}),
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

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col justify-center border-b-2 py-4 container">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex gap-2 items-end">
						<h1 className="my-1">{t("lectures")}</h1>
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
						<Button
							variant="ghost"
							size="icon"
							// onClick={() => refetch()}
						>
							<PlusIcon className="text-primary" />
						</Button>
					</div>
					<div className="flex flex-grow justify-center sm:justify-end mb-2 gap-2 flex-wrap">
						<div className="flex flex-col">
							<div className="flex items-center justify-between">
								<Label>{t("from")}</Label>
								<Button
									variant="link"
									size="sm"
									onClick={() => setFrom(undefined)}
								>
									{t("remove")}
								</Button>
							</div>
							<Input
								type="date"
								value={formatDate(from)}
								onChange={(e) =>
									setFrom(new Date(e.target.value))
								}
							/>
						</div>
						<div className="flex flex-col">
							<div className="flex gap-2 items-center justify-between">
								<Label>{t("to")}</Label>
								<Button
									variant="link"
									size="sm"
									onClick={() => setTo(undefined)}
								>
									{t("remove")}
								</Button>
							</div>
							<Input
								type="date"
								value={formatDate(to)}
								onChange={(e) =>
									setTo(new Date(e.target.value))
								}
							/>
						</div>
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
			<div className="flex-grow overflow-auto p-2 container">
				{isError ? (
					<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
						{error.message}
					</div>
				) : isPending ? (
					<div className="h-full flex justify-center items-center">
						<Spinner />
					</div>
				) : lectures.length === 0 ? (
					<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
						{t("no_students")}
					</div>
				) : (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
						{lectures.map((lecture) => (
							<Lecture key={lecture.id} lecture={lecture} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Filters, ControllerList } from "~/components/admin/controllers";
import { Spinner } from "~/components/loaders";
import { Pagination } from "~/components/pagination";
import useDebounce from "~/hooks/use-debounce";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { filterize } from "~/services/api";
import { getUsers } from "~/services/users";

export const Route = createFileRoute("/admin/controllers")({
	component: ControllersDashboard,
});

function ControllersDashboard() {
	const [filters, setFilters] = useState({
		name: "",
		role: "controller",
	});
	const debouncedFilters = useDebounce(filters, 1000);
	const {
		data: users,
		isPending,
		isRefetching,
		isError,
		error,
		page,
		pages,
		setPage,
	} = usePaginatedQuery({
		queryKey: ["controllers", debouncedFilters.name],
		queryFn: (pagination) =>
			getUsers({ ...pagination, ...filterize(debouncedFilters, true) }),
		options: {
			initialPage: 1,
			initialLimit: 25,
		},
	});

	useEffect(() => {
		setPage(1);
	}, [debouncedFilters]);

	function handleFilterChange(filter: string, value: any) {
		setFilters((prev) => ({
			...prev,
			[filter]: value,
		}));
	}

	return (
		<div className="p-4 flex flex-col h-full">
			<div className="flex justify-center sm:justify-between items-center gap-4 flex-wrap-reverse">
				<Pagination page={page} pages={pages} onChange={setPage} />
				<Filters onChange={handleFilterChange} filters={filters} />
			</div>

			<hr className="my-2 border-t-4" />

			<div className="flex-1 p-2 overflow-y-auto">
				{isError ? (
					<div className="flex items-center justify-center	h-full">
						<h4 className="text-destructive">{error.message}</h4>
					</div>
				) : isPending || isRefetching ? (
					<div className="flex items-center justify-center	h-full">
						<Spinner />
					</div>
				) : (
					<ControllerList controllers={users} />
				)}
			</div>
		</div>
	);
}

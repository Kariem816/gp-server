import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";

type PaginatedQueryProps<T> = {
	queryKey: string[];
	queryFn: ({
		page,
		limit,
	}: {
		page: number;
		limit: number;
	}) => Promise<PaginatedResponse<T>>;
	options: {
		initialPage: number;
		initialLimit: number;
	};
};

export function usePaginatedQuery<T = any>({
	queryKey,
	queryFn,
	options: { initialPage = 1, initialLimit = 25 },
}: PaginatedQueryProps<T>) {
	const [page, setPage] = useState(initialPage);
	const [limit, setLimit] = useState(initialLimit);
	const query = useQuery({
		queryKey: [...queryKey, page, limit],
		queryFn: () => queryFn({ page, limit }),
		placeholderData: keepPreviousData,
	});

	const { data, ...metadata } = query.data ?? { data: [] as T[], total: 0 };

	return {
		...query,
		data,
		page,
		setPage,
		limit,
		setLimit,
		pages: Math.ceil(metadata.total / limit),
		total: metadata.total,
	};
}

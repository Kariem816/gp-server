type QueryFilters = Record<string, any>;

declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

declare type PaginatedResponse<T = any> = {
	data: T[];
	total: number;
	page: number;
	limit: number;
	next?: string;
	prev?: string;
	last?: string;
	first?: string;
};

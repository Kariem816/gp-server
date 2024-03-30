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

declare type APIResponse<T = any> = {
	data: T;
	[key: string]: any;
};

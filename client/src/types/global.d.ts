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

declare type APIGenericError = {
	error: Exclude<string, "FORM_ERROR">;
	message: string;
};

declare type APIFormError = {
	error: "FORM_ERROR";
	messages: {
		path: string;
		message: string;
	}[];
};

declare type APIError = APIFormError | APIGenericError;

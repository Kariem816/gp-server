// list of all the error codes that the client can receive from the server
export type ClientErrorCodes =
	| "BAD_REQUEST"
	| "UNAUTHORIZED"
	| "FORBIDDEN"
	| "NOT_FOUND"
	| "CONFLICT";

export type ServerErrorCodes =
	| "INTERNAL_SERVER_ERROR"
	| "NOT_IMPLEMENTED"
	| "SERVICE_UNAVAILABLE";

export type ErrorCodes = ClientErrorCodes | ServerErrorCodes;

const clientErrorCodes: Record<number, ClientErrorCodes> = {
	400: "BAD_REQUEST",
	401: "UNAUTHORIZED",
	403: "FORBIDDEN",
	404: "NOT_FOUND",
	409: "CONFLICT",
};

const serverErrorCodes: Record<number, ServerErrorCodes> = {
	500: "INTERNAL_SERVER_ERROR",
	501: "NOT_IMPLEMENTED",
	503: "SERVICE_UNAVAILABLE",
};

export function getErrorCodeFromHttpStatus(
	httpStatus: number
): ErrorCodes | undefined {
	return clientErrorCodes[httpStatus] ?? serverErrorCodes[httpStatus];
}

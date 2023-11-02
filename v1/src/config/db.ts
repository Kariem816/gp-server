import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type PrismaClientError = {
	code?: string;
	meta?: {
		target: string[];
	};
	name?: string;
	message: string;
	clientVersion: string;
};

export type PrismaError = {
	httpStatus: number;
	simpleMessage: string;
	longMessage: string;
	originalError: PrismaClientError;
};

export const errCodesToMessages: Record<string, string> = {
	400: "BAD_REQUEST",
	401: "UNAUTHORIZED",
	403: "FORBIDDEN",
	404: "NOT_FOUND",
	405: "METHOD_NOT_ALLOWED",
	406: "NOT_ACCEPTABLE",
	418: "I_AM_A_TEAPOT",
};

export function parsePrismaError(
	originalError: PrismaClientError
): PrismaError {
	let httpStatus = 500;
	let simpleMessage = "Unknown error";
	let longMessage = "INTERNAL_SERVER_ERROR";

	if (!originalError.code) {
		if (originalError.name === "PrismaClientValidationError") {
			httpStatus = 400;
			simpleMessage = "missing required input";
			longMessage = "BAD_REQUEST";
		}

		return { httpStatus, simpleMessage, longMessage, originalError };
	}

	// common errors "P10XX" (not used in Prisma Client JS)
	if (originalError.code.startsWith("P10")) {
		simpleMessage = "Internal Server Error";
		return { httpStatus, simpleMessage, longMessage, originalError };
	}

	// Query engine errors "P20XX"
	if (originalError.code.startsWith("P20")) {
		switch (originalError.code) {
			case "P2000":
			case "P2019":
				httpStatus = 400;
				simpleMessage = "Input error";
				break;
			case "P2001":
			case "P2015":
			case "P2018":
				httpStatus = 404;
				simpleMessage = "Not found";
				break;
			case "P2002":
			case "P2003":
			case "P2004":
				httpStatus = 400;
				simpleMessage = "Invalid constraint";
				break;
			case "P2005":
			case "P2006":
			case "P2023":
				httpStatus = 400;
				simpleMessage = "Invalid field value";
				break;
			case "P2007":
			case "P2008":
			case "P2009":
			case "P2010":
			case "P2016":
			case "P2017":
				httpStatus = 500;
				simpleMessage = "Server could not process data";
				break;
			case "P2011":
			case "P2012":
			case "P2013":
				httpStatus = 400;
				simpleMessage = "Missing required input";
				break;
			case "P2014":
				httpStatus = 400;
				simpleMessage = "Prohibited change";
				break;
			case "P2020":
				httpStatus = 400;
				simpleMessage = "Range error";
				break;
			case "P2021":
				httpStatus = 500;
				simpleMessage = "Table does not exist";
				break;
			case "P2022":
				httpStatus = 500;
				simpleMessage = "Column does not exist";
				break;
			case "P2024":
				httpStatus = 500;
				simpleMessage = "Timeout";
				break;
			case "P2025":
				httpStatus = 400;
				simpleMessage = "Dependent record does not exist";
				break;
			case "P2026":
				httpStatus = 500;
				simpleMessage = "Database provider error";
				break;
			case "P2027":
				httpStatus = 500;
				simpleMessage = "Multiple errors";
				break;
			case "P2028":
				httpStatus = 500;
				simpleMessage = "Transaction error";
				break;
			case "P2030":
				httpStatus = 500;
				simpleMessage = "Server error";
				break;
			case "P2033":
				httpStatus = 500;
				simpleMessage = "Field error";
				break;
			case "P2034":
				httpStatus = 500;
				simpleMessage = "Transaction error";
		}

		longMessage = errCodesToMessages[httpStatus];

		return { httpStatus, simpleMessage, longMessage, originalError };
	}

	// schema engine errors "P30XX" (not used in Prisma Client JS)
	if (originalError.code.startsWith("P30")) {
		simpleMessage = "Internal Server Error";
		return { httpStatus, simpleMessage, longMessage, originalError };
	}

	// migration engine errors "P40XX" (not used in Prisma Client JS)
	if (originalError.code.startsWith("P40")) {
		simpleMessage = "Internal Server Error";
		return { httpStatus, simpleMessage, longMessage, originalError };
	}

	// data proxy errors "P50XX" (not used in Prisma Client JS)
	if (originalError.code.startsWith("P50")) {
		simpleMessage = "Internal Server Error";
		return { httpStatus, simpleMessage, longMessage, originalError };
	}

	return {
		httpStatus,
		simpleMessage,
		longMessage: errCodesToMessages[httpStatus],
		originalError,
	};
}

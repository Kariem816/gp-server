import { PrismaClient } from "@prisma/client";
import { env } from "@/config/env";
import { getErrorCodeFromHttpStatus } from "@/utils/http";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log:
			env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type PrismaClientError = {
	code?: string;
	meta?: {
		target: string[];
	};
	name?: string;
	message: string;
	clientVersion: string;
};

export class PrismaError extends Error {
	public httpStatus: number;
	public simpleMessage: string;
	public longMessage: string;

	constructor(public originalError: PrismaClientError) {
		const {
			httpStatus,
			message: simpleMessage,
			statusMessage: longMessage,
		} = PrismaError.parsePrismaError(originalError);

		super(longMessage);

		this.httpStatus = httpStatus;
		this.simpleMessage = simpleMessage;
		this.longMessage = longMessage;
	}

	static parsePrismaError(originalError: PrismaClientError): {
		httpStatus: number;
		message: string;
		statusMessage: string;
	} {
		let httpStatus = 500;
		let message = "Unknown error";
		let statusMessage = "INTERNAL_SERVER_ERROR";

		if (!originalError.code) {
			if (originalError.name === "PrismaClientValidationError") {
				httpStatus = 400;
				message = "there was an error validating your input";
				statusMessage = "BAD_REQUEST";
			}

			return {
				httpStatus,
				message,
				statusMessage,
			};
		}

		// common errors "P10XX" (not used in Prisma Client JS)
		if (originalError.code.startsWith("P10")) {
			message = "Internal Server Error";
			return {
				httpStatus,
				message,
				statusMessage,
			};
		}

		// Query engine errors "P20XX"
		if (originalError.code.startsWith("P20")) {
			switch (originalError.code) {
				case "P2000":
				case "P2019":
					httpStatus = 400;
					message = "Input error";
					break;
				case "P2001":
				case "P2015":
				case "P2018":
					httpStatus = 404;
					message = "Not found";
					break;
				case "P2002":
				case "P2003":
				case "P2004":
					httpStatus = 400;
					message = "Invalid constraint";
					break;
				case "P2005":
				case "P2006":
				case "P2023":
					httpStatus = 400;
					message = "Invalid field value";
					break;
				case "P2007":
				case "P2008":
				case "P2009":
				case "P2010":
				case "P2016":
				case "P2017":
					httpStatus = 500;
					message = "Server could not process data";
					break;
				case "P2011":
				case "P2012":
				case "P2013":
					httpStatus = 400;
					message = "Missing required input";
					break;
				case "P2014":
					httpStatus = 400;
					message = "Prohibited change";
					break;
				case "P2020":
					httpStatus = 400;
					message = "Range error";
					break;
				case "P2021":
					httpStatus = 500;
					message = "Table does not exist";
					break;
				case "P2022":
					httpStatus = 500;
					message = "Column does not exist";
					break;
				case "P2024":
					httpStatus = 500;
					message = "Timeout";
					break;
				case "P2025":
					httpStatus = 400;
					message = "Dependent record does not exist";
					break;
				case "P2026":
					httpStatus = 500;
					message = "Database provider error";
					break;
				case "P2027":
					httpStatus = 500;
					message = "Multiple errors";
					break;
				case "P2028":
					httpStatus = 500;
					message = "Transaction error";
					break;
				case "P2030":
					httpStatus = 500;
					message = "Server error";
					break;
				case "P2033":
					httpStatus = 500;
					message = "Field error";
					break;
				case "P2034":
					httpStatus = 500;
					message = "Transaction error";
			}

			statusMessage =
				getErrorCodeFromHttpStatus(httpStatus) ?? statusMessage;

			return {
				httpStatus,
				message,
				statusMessage,
			};
		}

		// schema engine errors "P30XX" (not used in Prisma Client JS)
		if (originalError.code.startsWith("P30")) {
			message = "Internal Server Error";
			return {
				httpStatus,
				message,
				statusMessage,
			};
		}

		// migration engine errors "P40XX" (not used in Prisma Client JS)
		if (originalError.code.startsWith("P40")) {
			message = "Internal Server Error";
			return {
				httpStatus,
				message,
				statusMessage,
			};
		}

		// data proxy errors "P50XX" (not used in Prisma Client JS)
		if (originalError.code.startsWith("P50")) {
			message = "Internal Server Error";
			return {
				httpStatus,
				message,
				statusMessage,
			};
		}

		return {
			httpStatus,
			message,
			statusMessage:
				getErrorCodeFromHttpStatus(httpStatus) ?? statusMessage,
		};
	}
}

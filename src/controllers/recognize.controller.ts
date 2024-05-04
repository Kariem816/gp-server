import { env } from "@/config/env";
import {
	// LPSchema,
	bulkParkingStateSchema,
	encodeImageResponseSchema,
	recognitionResponseSchema,
} from "@/schemas/recognizer.schema";
import axios from "axios";
import { z } from "zod";

export async function recognizeAttendance(
	imgUrl: string,
	studentsData: { id: string; imgs: string }[]
): Promise<{
	students: string[];
	faces: number;
}> {
	try {
		const response = await axios.post(
			env.RECOGNIZER_URL + "/recognition?token=" + env.RECOGNIZER_TOKEN,
			{
				img_url: imgUrl,
				encoded_dict: studentsData,
			}
		);

		if (response.status !== 200) {
			throw response.data;
		}

		const data = await recognitionResponseSchema.parseAsync(response.data);

		return data;
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			throw {
				error: "VALIDATION_ERROR",
				messages: err.errors,
			};
		}
		if (!err.response) {
			throw {
				error: "CONNECTION_ERROR",
				message:
					"Couldn't connect to the server. Please try again later",
			};
		}
		throw err.response.data;
	}
}

export async function encodeImage(
	imgUrl: string,
	prevData: string | null
): Promise<string> {
	try {
		const response = await axios.post(
			env.RECOGNIZER_URL + "/encoding?token=" + env.RECOGNIZER_TOKEN,
			{
				img: imgUrl,
				prev: prevData,
			}
		);

		if (response.status !== 200) {
			throw response.data;
		}

		const data = await encodeImageResponseSchema.parseAsync(response.data);

		return data;
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			throw {
				error: "VALIDATION_ERROR",
				messages: err.errors,
			};
		}
		if (!err.response) {
			throw {
				error: "CONNECTION_ERROR",
				message:
					"Couldn't connect to the server. Please try again later",
			};
		}
		throw err.response.data;
	}
}

// TODO: uncomment this in the future
// export async function readLP(imgUrl: string) {
// 	try {
// 		const response = await axios.get(
// 			`${env.RECOGNIZER_URL}/lp?token=${
// 				env.RECOGNIZER_TOKEN
// 			}&img=${encodeURI(imgUrl)}`
// 		);

// 		if (response.status !== 200) {
// 			throw response.data;
// 		}

// 		const data = await LPSchema.parseAsync(response.data);

// 		const numbers = data[0]
// 			.split("")
// 			.map((c) => String.fromCharCode(c.charCodeAt(0) - 1584))
// 			.join();

// 		return `${numbers}${data[1]}`;
// 	} catch (err: any) {
// 		if (err instanceof z.ZodError) {
// 			throw {
// 				error: "VALIDATION_ERROR",
// 				messages: err.errors,
// 			};
// 		}
// 		if (!err.response) {
// 			throw {
// 				error: "CONNECTION_ERROR",
// 				message:
// 					"Couldn't connect to the server. Please try again later",
// 			};
// 		}
// 		throw err.response.data;
// 	}
// }

export async function readSmartParkingState(imgUrl: string, spots: any[]) {
	try {
		const response = await axios.post(
			`${env.RECOGNIZER_URL}/parking?token=${env.RECOGNIZER_TOKEN}`,
			{ img: imgUrl, spots }
		);

		if (response.status !== 200) {
			throw response.data;
		}

		const data = await bulkParkingStateSchema.parseAsync(response.data);

		return data;
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			throw {
				error: "VALIDATION_ERROR",
				messages: err.errors,
			};
		}
		if (!err.response) {
			throw {
				error: "CONNECTION_ERROR",
				message:
					"Couldn't connect to the server. Please try again later",
			};
		}
		throw err.response.data;
	}
}

import { env } from "@/config/env";
import {
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

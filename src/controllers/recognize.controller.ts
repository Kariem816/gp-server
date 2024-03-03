import { env } from "@/config/env";
import axios from "axios";

export async function recognizeAttendance(
	imgUrl: string,
	studentsData: { id: string; imgs: string }[]
): Promise<string[]> {
	try {
		const response = await axios.post<string[]>(
			env.RECOGNIZER_URL + "/recognition?token=" + env.RECOGNIZER_TOKEN,
			{
				img_url: imgUrl,
				encoded_dict: studentsData,
			}
		);
		return response.data;
	} catch (err: any) {
		console.error(err.response);
		throw new Error("An error occurred while processing attendance");
	}
}

export async function encodeImage(
	imgUrl: string,
	prevData: string | null
): Promise<string> {
	try {
		const response = await axios.post<string>(
			env.RECOGNIZER_URL + "/encoding?token=" + env.RECOGNIZER_TOKEN,
			{
				img: imgUrl,
				prev: prevData,
			}
		);
		return response.data;
	} catch (err: any) {
		console.error(err.response.data);
		throw new Error("An error occurred while processing attendance");
	}
}

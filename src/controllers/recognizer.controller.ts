import userStore from "@/models/users.model";
import lectureStore from "@/models/lectures.model";
import { encodeImage, recognizeAttendance } from "@/services/recognizer";
import { sendNotifications } from "@/helpers/notifications";

export async function encodeAndUpdate(
	userId: string,
	fileUrl: string
): Promise<void> {
	try {
		const prevEncoding = await userStore.getImgEncoding(userId);
		const newEncoding = await encodeImage(fileUrl, prevEncoding);

		await userStore.updateImgEncoding(userId, newEncoding);
	} catch (err) {
		console.error("[Error:encodeAndUpdate]", err);
	}
}

export async function recognize(
	lectureId: string,
	imgId: string,
	fileUrl: string,
	tokens: string[]
): Promise<void> {
	try {
		// Get possible attendees
		const students = await lectureStore.getPossibleAttendees(lectureId);

		const attendance = await recognizeAttendance(fileUrl, students);

		await Promise.all([
			lectureStore.addLectureAttendees(
				lectureId,
				attendance.students,
				new Date()
			),
			lectureStore.updateLectureImg(
				imgId,
				attendance.students.length,
				attendance.faces
			),
		]);

		sendNotifications(tokens, {
			title: "Attendance processed",
			body:
				attendance.students.length +
				" students have been marked present",
		});
	} catch (err) {
		// TODO: add to queue to retry
		console.error("[Error:recognizeAttendance]", err);
		if (tokens.length > 0)
			await sendNotifications(tokens, {
				title: "Attendance upload failed",
				body: "An error occurred while processing attendance",
			});
	}
}

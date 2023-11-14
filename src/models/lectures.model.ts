import { prisma } from "@/config/db";
import type { PrismaClientError } from "@/config/db";

import type { Lecture, CourseProfile } from "@prisma/client";

class LecturesStore {
	async getLecture(id: Lecture["id"]) {}

	async addLecture(lectureData: Partial<Lecture>) {}

	async updateLecture(id: Lecture["id"], lectureData: Partial<Lecture>) {}

	async deleteLecture(id: Lecture["id"]) {}

	async deleteAllLectures() {}

	async getLectureAttendees(id: Lecture["id"]) {}

	async addLectureAttendee(
		id: Lecture["id"],
		attendeeId: CourseProfile["id"]
	) {}

	async removeLectureAttendee(
		id: Lecture["id"],
		attendeeId: CourseProfile["id"]
	) {}
}

export default new LecturesStore();

import { parsePrismaError, prisma } from "@/config/db";
import type { PrismaClientError } from "@/config/db";

import type { Lecture, CourseProfile } from "@prisma/client";

class LecturesStore {
	async getLectureCourseId(lectureId: Lecture["id"]) {
		try {
			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id: lectureId },
				select: { courseId: true },
			});
			return lecture.courseId;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getLecture(
		id: Lecture["id"],
		options: {
			page: number;
			limit: number;
			filters: any;
		}
	) {
		try {
			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id },
				include: {
					attendees: {
						where: options.filters,
						skip: (options.page - 1) * options.limit,
						take: options.limit,
						select: {
							id: true,
							studentId: true,
							student: {
								select: {
									id: true,
									userId: true,
									user: {
										select: {
											id: true,
											name: true,
										},
									},
								},
							},
						},
					},
					_count: {
						select: {
							attendees: true,
						},
					},
				},
			});
			return lecture;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async updateLecture(id: Lecture["id"], lectureData: Partial<Lecture>) {
		try {
			const lecture = await prisma.lecture.update({
				where: { id },
				data: {
					...lectureData,
					time: lectureData.time
						? new Date(lectureData.time)
						: undefined,
				},
			});
			return lecture;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteLecture(id: Lecture["id"]) {
		try {
			const lecture = await prisma.lecture.delete({
				where: { id },
			});
			return lecture;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteAllLectures() {
		try {
			const lectures = await prisma.lecture.deleteMany();
			return lectures;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getLectureAttendees(id: Lecture["id"]) {
		try {
			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id },
				include: { attendees: true },
			});
			return lecture.attendees;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async addLectureAttendees(
		id: Lecture["id"],
		attendees: CourseProfile["id"][]
	) {
		try {
			const lecture = await prisma.lecture.update({
				where: { id },
				data: {
					attendees: {
						connect: attendees.map((attendee) => ({
							id: attendee,
						})),
					},
				},
			});
			return lecture;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async removeLectureAttendees(
		id: Lecture["id"],
		attendees: CourseProfile["id"][]
	) {
		try {
			const lecture = await prisma.lecture.update({
				where: { id },
				data: {
					attendees: {
						disconnect: attendees.map((attendee) => ({
							id: attendee,
						})),
					},
				},
			});
			return lecture;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new LecturesStore();

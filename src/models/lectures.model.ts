import { PrismaError, prisma } from "@/config/db";
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
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getLecture(id: Lecture["id"]) {
		try {
			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id },
				include: {
					course: {
						select: {
							id: true,
							name: true,
							code: true,
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
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getActiveLectures(courseId?: string) {
		try {
			const lectures = await prisma.lecture.findMany({
				where: {
					courseId,
					time: {
						lte: new Date(),
					},
					ended: null,
				},
			});

			return lectures.filter((lecture) => {
				const endTime = new Date(lecture.time);
				endTime.setMinutes(endTime.getMinutes() + lecture.duration);
				return endTime > new Date();
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateLecture(
		id: Lecture["id"],
		lectureData: {
			time?: number;
			location?: string;
			duration?: number;
		}
	) {
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
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async finishLecture(id: Lecture["id"], time: Date) {
		try {
			const lecture = await prisma.lecture.update({
				where: { id },
				data: {
					ended: time,
				},
			});
			return lecture;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async deleteLecture(id: Lecture["id"]) {
		try {
			const lecture = await prisma.lecture.delete({
				where: { id },
			});
			return lecture;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async deleteAllLectures() {
		try {
			const lectures = await prisma.lecture.deleteMany();
			return lectures;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getLectureAttendees(
		id: Lecture["id"],
		options: {
			page: number;
			limit: number;
			filters: any;
		}
	) {
		try {
			const total = await prisma.lectureAttendees.count({
				where: {
					lectureId: id,
					...options.filters,
				},
			});
			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id },
				select: {
					attendees: {
						where: options.filters,
						skip: (options.page - 1) * options.limit,
						take: options.limit,
						select: {
							times: true,
							student: {
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
													img: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});

			return {
				data: lecture.attendees,
				page: options.page,
				limit: options.limit,
				total,
			};
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async addLectureAttendees(
		id: Lecture["id"],
		attendees: CourseProfile["id"][],
		time?: Date
	) {
		try {
			const attendancePromises: Promise<any>[] = [];
			attendees.forEach((attendee) => {
				attendancePromises.push(
					prisma.lectureAttendees.upsert({
						where: {
							lectureId_studentId: {
								lectureId: id,
								studentId: attendee,
							},
						},
						update: {
							times: time
								? {
										push: time,
									}
								: undefined,
						},
						create: {
							lectureId: id,
							studentId: attendee,
							times: [new Date()],
						},
					})
				);
			});

			await Promise.all(attendancePromises);

			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id },
				select: {
					_count: {
						select: {
							attendees: true,
						},
					},
				},
			});

			return lecture;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
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
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getPossibleAttendees(lectureId: Lecture["id"]) {
		try {
			// obsurdly complex query to get all students in a course
			const lecture = await prisma.lecture.findUniqueOrThrow({
				where: { id: lectureId },
				select: {
					course: {
						select: {
							students: {
								select: {
									id: true,
									student: {
										select: {
											user: {
												select: {
													encodedImageData: true,
												},
											},
										},
									},
								},
							},
						},
					},
				},
			});

			let studentsData: { id: string; imgs: string }[] = [];

			lecture.course.students.forEach((student) => {
				studentsData.push({
					id: student.id,
					imgs: student.student.user.encodedImageData ?? "",
				});
			});

			return studentsData;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getAttendanceImages(lectureId: Lecture["id"]) {
		try {
			return await prisma.upload.findMany({
				where: {
					metadata: {
						path: ["lectureId"],
						equals: lectureId,
					},
				},
				select: {
					url: true,
					metadata: true,
					size: true,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new LecturesStore();

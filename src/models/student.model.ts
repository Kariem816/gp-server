import { prisma, parsePrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import { env } from "@/config/env";

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

class StudentStore {
	async isStudent(studentId: string) {
		try {
			const student = await prisma.student.findUnique({
				where: {
					id: studentId,
				},
			});

			return !!student;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getCourses(
		studentId: string,
		options: {
			page: number;
			limit: number;
			semester?: string;
			filters: any;
		}
	) {
		try {
			const courses = await prisma.courseProfile.findMany({
				where: {
					studentId: studentId,
					course: {
						...options.filters,
					},
					semester: options?.semester
						? options.semester === "this"
							? env.CURR_SEMESTER
							: options.semester
						: undefined,
				},
				skip: options.page * options.limit,
				take: options.limit,
				select: {
					course: {
						select: {
							id: true,
							name: true,
							code: true,
							creditHours: true,
						},
					},
					semester: true,
				},
				orderBy: {
					semester: "desc",
				},
			});

			return courses;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getSchedule(studentId: string, until?: Date) {
		try {
			const coursesWithLectures = await prisma.courseProfile.findMany({
				where: {
					studentId: studentId,
					semester: env.CURR_SEMESTER,
				},
				select: {
					course: {
						select: {
							lectures: {
								where: {
									time: {
										gte: new Date(),
										lte: until
											? until
											: new Date(
													new Date().getTime() +
														ONE_WEEK_IN_MS
											  ),
									},
								},
								include: {
									course: {
										select: {
											id: true,
											name: true,
											code: true,
										},
									},
								},
							},
						},
					},
				},
			});

			const lectures = coursesWithLectures
				.map((course) => course.course.lectures)
				.flat();

			return lectures;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getAttendance(
		studentId: string,
		semester: string = env.CURR_SEMESTER
	) {
		try {
			const attendance = await prisma.lecture.findMany({
				where: {
					attendees: {
						some: {
							studentId: studentId,
							semester: semester,
						},
					},
				},
				select: {
					id: true,
					time: true,
					course: {
						select: {
							id: true,
							name: true,
							code: true,
						},
					},
				},
			});

			return attendance;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new StudentStore();

import { prisma, PrismaError } from "@/config/db";
import { env } from "@/config/env";

import type { Student } from "@prisma/client";
import type { PrismaClientError } from "@/config/db";

const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

class StudentStore {
	async index({
		page,
		limit,
		filters,
	}: {
		page: number;
		limit: number;
		filters: any;
	}) {
		try {
			const students = await prisma.student.findMany({
				where: filters,
				skip: (page - 1) * limit,
				take: limit,
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
						},
					},
					_count: {
						select: {
							registerations: true,
						},
					},
				},
			});

			return students;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async show(id: Student["id"]) {
		try {
			const student = await prisma.student.findUnique({
				where: {
					id,
				},
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							img: true,
						},
					},
					registerations: {
						select: {
							id: true,
							course: {
								select: {
									id: true,
									name: true,
									code: true,
								},
							},
							semester: true,
						},
					},
				},
			});

			return student;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async isStudent(studentId: string) {
		try {
			const student = await prisma.student.findUnique({
				where: {
					id: studentId,
				},
			});

			return !!student;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
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
	): Promise<PaginatedResponse> {
		try {
			const filters = {
				studentId: studentId,
				course: {
					...options.filters,
				},
				semester: options?.semester
					? options.semester === "this"
						? env.CURR_SEMESTER
						: options.semester
					: undefined,
			};

			const total = await prisma.courseProfile.count({
				where: filters,
			});

			const courses = await prisma.courseProfile.findMany({
				where: filters,
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

			return {
				data: courses,
				page: options.page,
				limit: options.limit,
				total,
			};
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
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
			throw new PrismaError(err as PrismaClientError);
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
							student: {
								semester: semester,
								studentId,
							},
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
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new StudentStore();

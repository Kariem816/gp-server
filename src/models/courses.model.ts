import { prisma, parsePrismaError } from "@/config/db";
import type { PrismaClientError } from "@/config/db";
import type { Course } from "@prisma/client";
import { env } from "@/config/env";

class CoursesStore {
	async index({
		limit,
		page,
		filters,
	}: {
		limit: number;
		page: number;
		filters: QueryFilters;
	}) {
		try {
			return await prisma.course.findMany({
				where: filters,
				skip: (page - 1) * limit,
				take: limit,
				select: {
					id: true,
					name: true,
					code: true,
					creditHours: true,
					teachers: true,
					_count: {
						select: {
							students: true,
						},
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async show(id: Course["id"]) {
		try {
			return await prisma.course.findUniqueOrThrow({
				where: {
					id,
				},
				select: {
					id: true,
					name: true,
					code: true,
					content: true,
					creditHours: true,
					teachers: true,
					_count: {
						select: {
							students: true,
						},
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async create(courseData: Course) {
		try {
			return await prisma.course.create({
				data: courseData,
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async update(id: Course["id"], courseData: Partial<Course>) {
		try {
			return await prisma.course.update({
				where: {
					id,
				},
				data: courseData,
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async delete(id: Course["id"]) {
		try {
			return await prisma.course.delete({
				where: {
					id,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteAll() {
		try {
			return await prisma.course.deleteMany();
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getStudents(
		id: Course["id"],
		{
			limit,
			page,
			filters,
		}: { limit: number; page: number; filters: QueryFilters }
	) {
		try {
			return await prisma.courseProfile.findMany({
				where: {
					courseId: id,
					student: {
						...filters,
					},
				},
				skip: (page - 1) * limit,
				take: limit,
				include: {
					student: {
						select: {
							user: {
								select: {
									id: true,
									name: true,
								},
							},
							courses: {
								select: {
									id: true,
									course: {
										select: {
											id: true,
											name: true,
										},
									},
								},
							},
						},
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async addStudent(id: Course["id"], studentId: string) {
		try {
			return await prisma.courseProfile.create({
				data: {
					course: {
						connect: {
							id,
						},
					},
					student: {
						connect: {
							id: studentId,
						},
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async isStudent(id: Course["id"], studentId: string, semester?: string) {
		try {
			const student = await prisma.courseProfile.findUnique({
				where: {
					studentId_courseId_semester: {
						studentId,
						courseId: id,
						semester: semester || env.CURR_SEMESTER,
					},
				},
				select: {
					id: true,
				},
			});

			return !!student;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async removeStudent(id: Course["id"], studentId: string) {
		try {
			return await prisma.courseProfile.delete({
				where: {
					studentId_courseId_semester: {
						studentId,
						courseId: id,
						semester: env.CURR_SEMESTER,
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getTeachers(id: Course["id"]) {
		try {
			return await prisma.course.findMany({
				where: {
					id,
				},
				include: {
					teachers: true,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async addTeacher(id: Course["id"], teacherId: string | string[]) {
		try {
			return await prisma.course.update({
				where: {
					id,
				},
				data: {
					teachers: {
						connect: Array.isArray(teacherId)
							? teacherId.map((id) => ({ id }))
							: { id: teacherId },
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async removeTeacher(id: Course["id"], teacherId: string) {
		try {
			return await prisma.course.update({
				where: {
					id,
				},
				data: {
					teachers: {
						disconnect: {
							id: teacherId,
						},
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async updateTeachers(
		id: Course["id"],
		addedTeachers: string[],
		removedTeachers: string[]
	) {
		try {
			return await prisma.course.update({
				where: {
					id,
				},
				data: {
					teachers: {
						connect: addedTeachers.map((id) => ({ id })),
						disconnect: removedTeachers.map((id) => ({ id })),
					},
				},
			});
		} catch (error) {
			throw parsePrismaError(error as PrismaClientError);
		}
	}

	async isTeacher(id: Course["id"], teacherId: string) {
		try {
			// TODO: Refactor this query
			const teacher = await prisma.course.findUnique({
				where: {
					id,
				},
				select: {
					teachers: {
						where: {
							id: teacherId,
						},
					},
				},
			});

			return !!teacher;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getLectures(
		id: Course["id"],
		{
			limit,
			page,
			filters,
		}: { limit: number; page: number; filters: QueryFilters }
	) {
		try {
			return await prisma.lecture.findMany({
				where: {
					courseId: id,
					...filters,
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: {
					time: "asc",
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async addLecture(courseId: Course["id"], lectureTime: string) {
		try {
			return await prisma.lecture.create({
				data: {
					time: new Date(lectureTime),
					course: {
						connect: {
							id: courseId,
						},
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new CoursesStore();

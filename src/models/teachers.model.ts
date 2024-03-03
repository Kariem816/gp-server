import { prisma, PrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import { Teacher } from "@prisma/client";

class TeacherStore {
	async index({
		page,
		limit,
		filters,
	}: {
		page: number;
		limit: number;
		filters: any;
	}): Promise<PaginatedResponse> {
		try {
			const total = await prisma.teacher.count({
				where: filters,
			});
			const teachers = await prisma.teacher.findMany({
				where: filters,
				skip: (page - 1) * limit,
				take: limit,
				select: {
					id: true,
					user: {
						select: {
							id: true,
							name: true,
							img: true,
						},
					},
					_count: {
						select: {
							courses: true,
						},
					},
				},
			});

			return {
				data: teachers,
				page,
				limit,
				total,
			};
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async show(id: Teacher["id"]) {
		try {
			const teacher = await prisma.teacher.findUnique({
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
					courses: {
						select: {
							id: true,
							name: true,
							code: true,
						},
					},
				},
			});

			return teacher;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getTeacherCourses(id: Teacher["id"]) {
		try {
			const courses = await prisma.course.findMany({
				where: {
					teachers: {
						some: {
							id,
						},
					},
				},
				select: {
					id: true,
					name: true,
					code: true,
					_count: {
						select: {
							students: true,
						},
					},
				},
			});

			return courses;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getTeacherLectures(id: Teacher["id"]) {
		try {
			const lectures = await prisma.lecture.findMany({
				where: {
					course: {
						teachers: {
							some: {
								id,
							},
						},
					},
				},
				select: {
					id: true,
					time: true,
					duration: true,
					location: true,
					ended: true,
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
				orderBy: {
					time: "asc",
				},
			});

			return lectures;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getTeacherIdByUserId(userId: string) {
		try {
			const teacher = await prisma.teacher.findUnique({
				where: {
					userId,
				},
				select: {
					id: true,
				},
			});

			return teacher?.id;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new TeacherStore();

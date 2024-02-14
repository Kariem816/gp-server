import { prisma, parsePrismaError } from "@/config/db";

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
	}) {
		try {
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

			return teachers;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
				},
			});

			return courses;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new TeacherStore();

import type { Request, Response, NextFunction } from "express";
import { prisma } from "@/config/db";

import type { Course } from "@prisma/client";

export async function getCourseProfile(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		if (!res.locals.user) {
			return res.status(403).json({
				error: "FORBIDDEN",
				message: "You are not allowed to access this resource",
			});
		}

		switch (res.locals.user.role) {
			case "student": {
				const student = await prisma.student.findUnique({
					where: {
						userId: res.locals.user.id,
					},
					include: {
						courses: true,
					},
				});

				if (!student)
					return res.status(403).json({
						error: "FORBIDDEN",
						message: "You are not allowed to access this resource",
					});

				res.locals.student = student;
				break;
			}
			case "teacher": {
				const teacher = await prisma.teacher.findUnique({
					where: {
						userId: res.locals.user.id,
					},
					include: {
						courses: true,
					},
				});

				if (!teacher)
					return res.status(403).json({
						error: "FORBIDDEN",
						message: "You are not allowed to access this resource",
					});

				res.locals.teacher = teacher;
				break;
			}
			case "admin": {
				break;
			}
			default: {
				return res.status(403).json({
					error: "FORBIDDEN",
					message: "You are not allowed to access this resource",
				});
			}
		}
		next();
	} catch (err: any) {
		console.error(err);
	}
}

export async function mustBeCourseTeacher(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const courseId = req.params.id;
	if (courseId === undefined) {
		console.error("courseId is undefined");
		res.status(500).json({
			error: "INTERNAL_SERVER_ERROR",
			message: "Something went wrong. Please try again later",
		});
		return;
	}

	if (res.locals.user.role === "admin") return next();

	const { teacher } = res.locals;
	if (teacher === undefined) {
		res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
		return;
	}

	const isCourseTeacher = teacher.courses.some(
		(course: Course) => course.id === courseId
	);

	if (!isCourseTeacher) {
		res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
		return;
	}

	next();
}

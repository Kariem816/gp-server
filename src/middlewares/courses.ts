import type { Request, Response, NextFunction } from "express";

import { prisma } from "@/config/db";

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

import type { Request, Response, NextFunction } from "express";
import type { Course } from "@prisma/client";

export function saveCourseId(req: Request, res: Response, next: NextFunction) {
	const { courseId } = req.params;
	if (courseId === undefined) {
		res.status(400).json({
			error: "BAD_REQUEST",
			message: "Course ID is required",
		});
		return;
	}

	res.locals.courseId = courseId;
	next();
}

export async function mustBeCourseTeacher(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { courseId } = res.locals;
	if (courseId === undefined) {
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

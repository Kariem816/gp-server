import type { Request, Response, NextFunction } from "express";
import type { Course } from "@prisma/client";
import lectureStore from "@/models/lectures.model";
import { formatError } from "@/helpers";

export async function canModifyLecture(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const lectureId = req.params.id;
		if (!lectureId) {
			return res.status(500).json({
				error: "INTERNAL_SERVER_ERROR",
				message: "Something went wrong. Please try again later",
			});
		}
		const courseId = await lectureStore.getLectureCourseId(lectureId);

		if (res.locals.user.role !== "admin") {
			const isCourseTeacher = res.locals.teacher.courses.some(
				(course: Course) => course.id === courseId
			);

			if (!isCourseTeacher)
				return res.status(403).json({
					error: "FORBIDDEN",
					message: "You are not allowed to access this resource",
				});
		}

		next();
	} catch (err: any) {
		console.error(err);
		const { status, error } = formatError(err);
		res.status(status).json(error);
	}
}

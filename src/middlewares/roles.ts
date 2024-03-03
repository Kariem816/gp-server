import { UserRole } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

export default function (_req: Request, res: Response, next: NextFunction) {
	if (!res.locals.user) {
		return res.status(401).json({
			error: "UNAUTHORIZED",
			message: "You must be logged in to access this resource",
		});
	}

	next();
}

export function isLoggedIn(_req: Request, res: Response, next: NextFunction) {
	res.locals.isLoggedIn = !!res.locals.user;
	next();
}

export function mustBe(role: UserRole | UserRole[]) {
	return function (_req: Request, res: Response, next: NextFunction) {
		if (Array.isArray(role)) {
			if (!role.includes(res.locals.user?.role)) {
				return res.status(403).json({
					error: "FORBIDDEN",
					message: "You are not allowed to access this resource",
				});
			}
		} else if (res.locals.user?.role !== role) {
			return res.status(403).json({
				error: "FORBIDDEN",
				message: "You are not allowed to access this resource",
			});
		}

		next();
	};
}

export function mustBeAdmin(_req: Request, res: Response, next: NextFunction) {
	if (res.locals.user?.role !== "admin") {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeStudent(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (res.locals.user?.role !== "student") {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeTeacher(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (res.locals.user?.role !== "teacher") {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeController(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (res.locals.user?.role !== "controller") {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeSecurity(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (res.locals.user?.role !== "security") {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeAdminOrController(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (
		res.locals.user?.role !== "admin" &&
		res.locals.user?.role !== "controller"
	) {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeAdminOrTeacher(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (
		res.locals.user?.role !== "admin" &&
		res.locals.user?.role !== "teacher"
	) {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeAdminOrSecurity(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (
		res.locals.user?.role !== "admin" &&
		res.locals.user?.role !== "security"
	) {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

export function mustBeAdminOrStudent(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (
		res.locals.user?.role !== "admin" &&
		res.locals.user?.role !== "student"
	) {
		return res.status(403).json({
			error: "FORBIDDEN",
			message: "You are not allowed to access this resource",
		});
	}

	next();
}

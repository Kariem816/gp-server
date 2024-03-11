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

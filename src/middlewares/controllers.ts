import controllersModel from "@/models/controllers.model";
import { ControlElement } from "@prisma/client";

import type { Request, Response, NextFunction } from "express";

export function allowedController(...allowed: ControlElement[]) {
	return async (_req: Request, res: Response, next: NextFunction) => {
		if (res.locals.user?.role === "admin") return next();
		if (res.locals.user?.role === "controller") {
			let perms = res.locals.controller.controls;
			if (!perms) {
				perms = (
					await controllersModel.getControllerByUserId(
						res.locals.user.id
					)
				).controls;
			}
			if (allowed.every((control) => perms.includes(control))) {
				return next();
			}
		}
		if (!res.locals.user) {
			return res.status(401).json({
				error: "UNAUTHORIZED",
				message: "You must be logged in to access this resource",
			});
		}

		res.status(403).json({
			error: "FORBIDDEN",
			message: "You do not have permission to access this resource",
		});
	};
}

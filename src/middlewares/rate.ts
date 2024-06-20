import { rateLimit } from "express-rate-limit";

import type { Request, Response, NextFunction } from "express";

const ONE_MINUTE = 60 * 1000;

const guestLimiter = rateLimit({
	windowMs: ONE_MINUTE,
	limit: 60,
	validate: {
		trustProxy: true,
	},
	message: {
		error: "TOO_MANY_REQUESTS",
		message: "You have exceeded your request limit!",
	},
});

const userLimiter = rateLimit({
	windowMs: ONE_MINUTE,
	limit: 100,
	validate: {
		trustProxy: true,
	},
	message: {
		error: "TOO_MANY_REQUESTS",
		message: "You have exceeded your request limit!",
	},
});

const controllerLimiter = rateLimit({
	windowMs: ONE_MINUTE,
	limit: 200,
	validate: {
		trustProxy: true,
	},
	message: {
		error: "TOO_MANY_REQUESTS",
		message:
			"You have exceeded your request limit! Please add a delay to your requests.",
	},
});

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
	if (res.locals.user) {
		if (res.locals.user.role === "controller") {
			controllerLimiter(req, res, next);
		} else {
			userLimiter(req, res, next);
		}
	} else {
		guestLimiter(req, res, next);
	}
}

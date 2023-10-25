import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "@/utils/jwt";

export default async function getUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const accessToken = req.headers.authorization?.split(" ")[1] ?? null;

		// if there is no access token, just continue
		if (!accessToken) return next();

		// verify the access token
		const { payload } = verifyJWT(accessToken);

		// if the access token is expired, just continue
		// if the access token is valid, set the user in the locals
		if (payload?.user) {
			res.locals.user = payload.user;
			return next();
		}

		// if the access token is invalid, just continue
		next();
	} catch (err) {
		return next();
	}
}

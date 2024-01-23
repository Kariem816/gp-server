import type { Request, Response, NextFunction } from "express";
import { verifyJWT } from "@/utils/jwt.js";

import type { User, Session } from "@prisma/client";

type LocalUser = User & {
	sid: Session["id"];
};

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
			res.locals.user = payload.user as LocalUser;
			return next();
		}

		// if the access token is invalid, just continue
		next();
	} catch (err) {
		return next();
	}
}

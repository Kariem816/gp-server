import { verifyJWT } from "@/utils/jwt";
import controllerStore from "@/models/controllers.model";

import type { Request, Response, NextFunction } from "express";
import type { User, Session } from "@prisma/client";

type LocalUser = User & {
	sid?: Session["id"];
};

export default async function getUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const accessToken = req.headers.authorization?.split(" ")[1] ?? null;
		const apiKey = req.headers["x-api-key"] ?? null;

		if (accessToken) {
			const user = getUserFromBearerToken(accessToken);
			// if the access token is valid, set the user in the locals
			if (user) {
				res.locals.user = user;
			}
		} else if (apiKey) {
			const user = await getUserFromApiKey(
				Array.isArray(apiKey) ? apiKey[0] : apiKey
			);
			// if the access token is valid, set the user in the locals
			if (user) {
				res.locals.user = user;
			}
		}

		// if the access token is invalid, just continue
		next();
	} catch (err) {
		return next();
	}
}

function getUserFromBearerToken(accessToken: string): LocalUser | null {
	// verify the access token
	const { payload } = verifyJWT(accessToken);

	// if the access token is expired, return null
	if (payload?.user) {
		return payload.user as LocalUser;
	}

	return null;
}

async function getUserFromApiKey(apiKey: string): Promise<LocalUser | null> {
	try {
		// get the user from the api key
		const apiKeyObj = await controllerStore.getApiKey(apiKey);

		// if the api key is expired, return null
		if (apiKeyObj.expiresAt && apiKeyObj.expiresAt < new Date()) {
			return null;
		}

		return apiKeyObj.controller.user;
	} catch (err) {
		return null;
	}
}

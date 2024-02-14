import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "@/config/env";

const { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } = env;

export function signJWT(payload: string | object, expiresIn: string | number) {
	return jwt.sign(payload, JWT_PRIVATE_KEY, {
		expiresIn,
		algorithm: "RS256",
	});
}

export function verifyJWT(token: string): {
	payload: JwtPayload | null;
	expired: boolean;
} {
	try {
		const decoded = jwt.verify(token, JWT_PUBLIC_KEY) as JwtPayload;
		return { payload: decoded, expired: false };
	} catch (err: any) {
		return { payload: null, expired: err.message.includes("expired") };
	}
}

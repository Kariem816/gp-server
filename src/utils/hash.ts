import bcrypt from "bcryptjs";
import { env } from "@/config/env";

export async function hashPassword(password: string): Promise<string> {
	const { SALT, PEPPER } = env;
	const salt = await bcrypt.genSalt(SALT);
	const hashPassword = await bcrypt.hash(password + PEPPER, salt);

	return hashPassword;
}

export async function comparePassword(
	password: string,
	hashPassword: string
): Promise<boolean> {
	const { PEPPER } = env;
	const isMatch = await bcrypt.compare(password + PEPPER, hashPassword);

	return isMatch;
}

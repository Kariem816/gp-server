import { config } from "dotenv";

config();

type Env = {
	NODE_ENV: string;
	PORT: number;
	DATABASE_URL: string;
	SALT: number;
	PEPPER: string;
	JWT_PRIVATE_KEY: string;
	JWT_PUBLIC_KEY: string;
};

export const env: Env = {
	NODE_ENV: process.env.NODE_ENV!,
	PORT: Number(process.env.PORT!),
	DATABASE_URL: process.env.DATABASE_URL!,
	SALT: Number(process.env.SALT!),
	PEPPER: process.env.PEPPER!,
	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY!,
	JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY!,
};

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
	CURR_SEMESTER: string;
	UPLOADTHING_SECRET: string;
	UPLOADTHING_APP_ID: string;
};

export const env: Env = {
	NODE_ENV: process.env.NODE_ENV!,
	PORT: Number(process.env.PORT!),
	DATABASE_URL: process.env.DATABASE_URL!,
	SALT: Number(process.env.SALT!),
	PEPPER: process.env.PEPPER!,
	JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY!,
	JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY!,
	CURR_SEMESTER: process.env.CURR_SEMESTER!,
	UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET!,
	UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID!,
};

import { createEnv } from "@/utils/env";

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
	EXPO_ACCESS_TOKEN: string;
	CAMERA_USERNAME: string;
	CAMERA_PASSWORD: string;
	RECOGNIZER_TOKEN: string;
	RECOGNIZER_URL: string;
};

export const env = createEnv<Env>({
	values: {
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT,
		DATABASE_URL: process.env.DATABASE_URL,
		SALT: process.env.SALT,
		PEPPER: process.env.PEPPER,
		JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
		JWT_PUBLIC_KEY: process.env.JWT_PUBLIC_KEY,
		CURR_SEMESTER: process.env.CURR_SEMESTER,
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
		EXPO_ACCESS_TOKEN: process.env.EXPO_ACCESS_TOKEN,
		CAMERA_USERNAME: process.env.CAMERA_USERNAME,
		CAMERA_PASSWORD: process.env.CAMERA_PASSWORD,
		RECOGNIZER_TOKEN: process.env.RECOGNIZER_TOKEN,
		RECOGNIZER_URL: process.env.RECOGNIZER_URL,
	},
	transform: {
		PORT: Number,
		SALT: Number,
	},
});

import { config } from "dotenv";

config();

type TEnvConfig<T> = {
	values: {
		[K in keyof T]: string | undefined;
	};
	devOnly?: (keyof T)[];
	prodOnly?: (keyof T)[];
	transform?: {
		[K in keyof T]?: (value: string) => T[K];
	};
};

export function createEnv<
	T extends Readonly<Record<string, string | number | boolean>>
>(config: TEnvConfig<T>): T {
	const { values, devOnly = [], prodOnly = [], transform } = config;
	const isDev = process.env.NODE_ENV === "development";

	const env: Record<string, string | number | boolean> = {};

	for (const [key, value] of Object.entries(values)) {
		if (value === undefined) {
			if (isDev && devOnly.includes(key)) {
				continue;
			}
			if (!isDev && prodOnly.includes(key as keyof T)) {
				continue;
			}
			throw new Error(`Missing environment variable: ${key}`);
		}

		env[key] = transform?.[key]?.(value) ?? value;
	}

	return env as T;
}

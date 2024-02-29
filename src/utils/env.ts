import { config } from "dotenv";

config();

type TEnvConfig<T> = {
	values: {
		[K in keyof T]: string | undefined;
	};
	transform?: {
		[K in keyof T]?: (value: string) => T[K];
	};
};

export function createEnv<
	T extends Readonly<Record<string, string | number | boolean>>,
>(config: TEnvConfig<T>): T {
	const { values, transform } = config;

	const env: Record<string, string | number | boolean> = {};

	for (const [key, value] of Object.entries(values)) {
		if (value === undefined) {
			throw new Error(`Missing environment variable: ${key}`);
		}

		env[key] = transform?.[key]?.(value) ?? value;
	}

	return env as T;
}

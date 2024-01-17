export function isVersion(version: string): boolean {
	return /^\d+\.\d+\.\d+$/.test(version);
}

export function parseVersion(version: string): {
	major: number;
	minor: number;
	patch: number;
	number: number;
} {
	if (!isVersion(version)) {
		throw new Error("Invalid version number");
	}

	const [major, minor, patch] = version.split(".").map((v) => parseInt(v));
	const number = major * 10000 + minor * 100 + patch;

	return { major, minor, patch, number };
}

export function numberToVersion(version: number): string {
	const major = Math.floor(version / 10000);
	const minor = Math.floor((version % 10000) / 100);
	const patch = version % 100;

	return `${major}.${minor}.${patch}`;
}

export function versionToNumber(version: string): number {
	const { number } = parseVersion(version);
	return number;
}

export function compareVersions(
	version1: string,
	version2: string
): -1 | 0 | 1 {
	const { number: number1 } = parseVersion(version1);
	const { number: number2 } = parseVersion(version2);

	if (number1 > number2) {
		return 1;
	} else if (number1 < number2) {
		return -1;
	} else {
		return 0;
	}
}

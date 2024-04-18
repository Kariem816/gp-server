// import type { Light } from "@prisma/client";

export function shouldTurnOn(/* light: Light */): boolean {
	const now = new Date();

	return now.getHours() < 6 || now.getHours() >= 19;
}

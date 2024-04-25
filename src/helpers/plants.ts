import type { Plant } from "@prisma/client";

const hour = 60 * 60 * 1000;

const WateringInfo: Record<string, [number, number]> = {
	//name: [watered for, watered every]
	default: [5, 24 * hour],
};

export function shouldWater(plant: Plant, moisture: number): boolean {
	return moisture < 50;
	// const [wateredFor, wateredEvery] =
	// 	WateringInfo[plant.type] ?? WateringInfo.default;

	// const now = Date.now();
	// if (plant.isWatering) {
	// 	return now - plant.lastUpdated.getTime() >= wateredFor;
	// }

	// return now - plant.lastUpdated.getTime() >= wateredEvery - wateredFor;
}

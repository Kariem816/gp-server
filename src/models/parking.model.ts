import { prisma, PrismaError } from "@/config/db";
import type { PrismaClientError } from "@/config/db.js";
import { SmartParkingSpotSchema } from "@/schemas/smart-parking.schema";

import type { z } from "zod";

type ParkingSpot = z.infer<typeof SmartParkingSpotSchema>;

class parkingstore {
	async index() {
		try {
			const park = await prisma.parkingSpot.findMany({
				select: {
					id: true,
					location: true,
					isEmpty: true,
					isSmart: true,
				},
			});
			return park;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async show(id: string) {
		try {
			return await prisma.parkingSpot.findUniqueOrThrow({
				where: {
					id,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async showSmart() {
		try {
			const park = await prisma.parkingSpot.findMany({
				where: {
					isSmart: true,
				},
			});
			return park;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async createDumb(location: string) {
		try {
			return await prisma.parkingSpot.create({
				data: {
					location,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async createSmart(data: ParkingSpot[]) {
		try {
			await prisma.parkingSpot.deleteMany({
				where: {
					isSmart: true,
				},
			});

			const smartSpots = await prisma.$transaction(
				data.map((spot) =>
					prisma.parkingSpot.create({
						data: {
							...spot,
							isSmart: true,
						},
					})
				)
			);

			return smartSpots.length;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(spotId: string, isEmpty: boolean) {
		try {
			return await prisma.parkingSpot.update({
				where: {
					id: spotId,
				},
				data: {
					isEmpty,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateMany(data: Array<{ id: string; isEmpty: boolean }>) {
		try {
			return await Promise.all(
				data.map((spot) => this.update(spot.id, spot.isEmpty))
			);
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async delete(id: string) {
		try {
			return await prisma.parkingSpot.delete({
				where: {
					id,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async countEmpty() {
		try {
			return await prisma.parkingSpot.count({
				where: {
					isEmpty: true,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}
export default new parkingstore();

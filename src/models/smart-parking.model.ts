import { prisma, PrismaError } from "@/config/db";
import { SmartParkingSpotSchema } from "@/schemas/smart-parking.schema";
import { z } from "zod";

import type { PrismaClientError } from "@/config/db";
import type { SmartSpot } from "@prisma/client";

type ParkingSpot = z.infer<typeof SmartParkingSpotSchema>;

class parkingstore {
	async index(): Promise<SmartSpot[]> {
		try {
			const park = await prisma.smartSpot.findMany();
			return park;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async indexForRecognition() {
		try {
			const spots = await prisma.smartSpot.findMany({
				select: {
					id: true,
					poly: true,
				},
			});

			return spots;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async save(data: ParkingSpot[]): Promise<number> {
		try {
			await prisma.smartSpot.deleteMany();

			const smartSpots = await prisma.smartSpot.createMany({
				data: data,
			});

			return smartSpots.count;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async isEmpty(id: string): Promise<boolean> {
		try {
			const { isEmpty } = await prisma.smartSpot.findUniqueOrThrow({
				where: {
					id: id,
				},
				select: {
					isEmpty: true,
				},
			});

			return isEmpty;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(data: { id: string; occupied: boolean }[]): Promise<void> {
		try {
			await prisma.$transaction(
				data.map((spot) =>
					prisma.smartSpot.update({
						where: {
							id: spot.id,
						},
						data: {
							isEmpty: !spot.occupied,
						},
					})
				)
			);
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async countEmpty(): Promise<number> {
		try {
			const count = await prisma.smartSpot.count({
				where: {
					isEmpty: true,
				},
			});

			return count;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}
export default new parkingstore();

import { prisma, PrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import type { Plant } from "@prisma/client";

class IrrigationStore {
	async index({
		page,
		limit,
	}: {
		page: number;
		limit: number;
	}): Promise<PaginatedResponse<Plant>> {
		try {
			const take = limit;
			const skip = (page - 1) * limit;

			const total = await prisma.plant.count();
			const plants = await prisma.plant.findMany({
				take,
				skip,
			});

			return {
				data: plants,
				page: 1,
				limit: total,
				total,
			};
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async show(id: string) {
		try {
			return await prisma.plant.findUniqueOrThrow({
				where: {
					id,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async showMany(ids: string[]) {
		try {
			return await prisma.plant.findMany({
				where: {
					id: {
						in: ids,
					},
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async create(type: string) {
		try {
			return await prisma.plant.create({
				data: { type, isWatering: false, lastUpdated: new Date() },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(id: string, isWatering: boolean) {
		try {
			return await prisma.plant.update({
				where: {
					id,
				},
				data: { isWatering, lastUpdated: new Date() },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateMany(plants: { id: string; isWatering: boolean }[]) {
		try {
			return await Promise.all(
				plants.map((plant) => this.update(plant.id, plant.isWatering))
			);
		} catch (err) {
			// TODO: Parse errors and return a more meaningful error
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async delete(id: string) {
		try {
			return await prisma.plant.delete({
				where: {
					id,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new IrrigationStore();

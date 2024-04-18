import { prisma, PrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import type { Light } from "@prisma/client";

class LightingStore {
	async index({
		page,
		limit,
	}: {
		page: number;
		limit: number;
	}): Promise<PaginatedResponse<Light>> {
		try {
			const take = limit;
			const skip = (page - 1) * limit;

			const total = await prisma.light.count();
			const lights = await prisma.light.findMany({
				take,
				skip,
			});

			return {
				data: lights,
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
			return await prisma.light.findUniqueOrThrow({
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
			return await prisma.light.findMany({
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

	async create(location: string) {
		try {
			return await prisma.light.create({
				data: { location, state: false },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(id: string, state: boolean) {
		try {
			return await prisma.light.update({
				where: {
					id,
				},
				data: { state },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateMany(lights: { id: string; state: boolean }[]) {
		try {
			return await Promise.all(
				lights.map((light) => this.update(light.id, light.state))
			);
		} catch (err) {
			// TODO: Parse errors and return a more meaningful error
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async delete(id: string) {
		try {
			return await prisma.light.delete({
				where: {
					id,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new LightingStore();

import { prisma, PrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import type { TrashCan } from "@prisma/client";

class TrashStore {
	async index({
		page,
		limit,
	}: {
		page: number;
		limit: number;
	}): Promise<PaginatedResponse<TrashCan>> {
		try {
			const take = limit;
			const skip = (page - 1) * limit;

			const total = await prisma.trashCan.count();
			const trash = await prisma.trashCan.findMany({
				take,
				skip,
			});

			return {
				data: trash,
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
			return await prisma.trashCan.findUniqueOrThrow({
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
			return await prisma.trashCan.findMany({
				where: {
					id: {
						in: ids,
					},
				},
				select: {
					id: true,
					level: true,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async create(
		data: PartialBy<Omit<TrashCan, "id">, "level" | "lastEmptied">
	) {
		try {
			return await prisma.trashCan.create({
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(id: string, data: { level: number; lastEmptied?: Date }) {
		try {
			return await prisma.trashCan.update({
				where: {
					id,
				},
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateMany(
		data: Array<{ id: string; level: number; lastEmptied?: Date }>
	) {
		try {
			return await Promise.all(
				data.map((item) => this.update(item.id, item))
			);
		} catch (err) {
			// TODO: Parse errors and return a more meaningful error
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async edit(id: string, data: { level?: number; location?: string }) {
		try {
			return await prisma.trashCan.update({
				where: {
					id,
				},
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async editMany(
		data: Array<{ id: string; level?: number; location?: string }>
	) {
		try {
			return await Promise.all(
				data.map((item) => this.edit(item.id, item))
			);
		} catch (err) {
			// TODO: Parse errors and return a more meaningful error
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async delete(id: string) {
		try {
			return await prisma.trashCan.delete({
				where: {
					id,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getFilledTrash() {
		try {
			// TODO: adjust the period for real-world usage
			const allowdPeriod = 30 * 1000; // 30 seconds
			const lastAllowedEmptied = Date.now() - allowdPeriod;
			return await prisma.trashCan.findMany({
				where: {
					OR: [
						{
							level: {
								gte: 70,
							},
						},
						{
							lastEmptied: {
								lt: new Date(lastAllowedEmptied),
							},
						},
					],
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getSecurityNotifications() {
		try {
			const tokens = await prisma.session.findMany({
				distinct: ["notificationToken"],
				where: {
					notificationToken: {
						not: null,
					},
					active: true,
					user: {
						role: "security",
					},
				},
				select: {
					notificationToken: true,
				},
			});

			return tokens.map((token) => token.notificationToken);
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new TrashStore();

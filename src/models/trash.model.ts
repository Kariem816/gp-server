import { prisma, PrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import type { TrashCan } from "@prisma/client";

class TrashStore {
	async index(): Promise<PaginatedResponse<TrashCan>> {
		try {
			const total = await prisma.trashCan.count();
			const trash = await prisma.trashCan.findMany();
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

	async create(data: PartialBy<Omit<TrashCan, "id">, "level">) {
		try {
			return await prisma.trashCan.create({
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(id: string, data: Omit<Omit<TrashCan, "id">, "location">) {
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

	async updateMany(data: Array<{ id: string; level: number }>) {
		try {
			return await Promise.all(
				data.map((item) => this.update(item.id, item))
			);
		} catch (err) {
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
}

export default new TrashStore();

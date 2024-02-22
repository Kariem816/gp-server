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

	async create(data: TrashCan) {
		try {
			return await prisma.trashCan.create({
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(id: string, data: TrashCan) {
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

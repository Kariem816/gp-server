import { prisma, parsePrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import type { TrashCan } from "@prisma/client";

class TrashStore {
	async index() {
		try {
			const trash = await prisma.trashCan.findMany();
			return trash;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async create(data: TrashCan) {
		try {
			return await prisma.trashCan.create({
				data,
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new TrashStore();

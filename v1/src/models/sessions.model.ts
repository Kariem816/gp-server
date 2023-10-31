import { prisma, parsePrismaError } from "@/config/db";
import type { PrismaClientError } from "@/config/db";

class SessionStore {
	async create(userId: string) {
		try {
			return await prisma.session.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
				},
			});
		} catch (err: any) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async get(sid: string) {
		try {
			return await prisma.session.findUnique({
				where: {
					id: sid,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async getAllByUser(userId: string) {
		try {
			return await prisma.session.findMany({
				where: {
					userId: userId,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async delete(id: string) {
		try {
			return await prisma.session.delete({
				where: {
					id: id,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteAll() {
		try {
			return await prisma.session.deleteMany();
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteAllByUser(userId: string) {
		try {
			return await prisma.session.deleteMany({
				where: {
					userId: userId,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async invalidate(sid: string) {
		try {
			return await prisma.session.update({
				where: {
					id: sid,
				},
				data: {
					active: false,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async invalidateAll() {
		try {
			return await prisma.session.updateMany({
				data: {
					active: false,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}

	async invalidateAllByUser(userId: string) {
		try {
			return await prisma.session.updateMany({
				where: {
					userId: userId,
				},
				data: {
					active: false,
				},
			});
		} catch (err) {
			parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new SessionStore();

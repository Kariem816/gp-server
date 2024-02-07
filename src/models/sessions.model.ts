import { prisma, parsePrismaError } from "@/config/db.js";
import type { PrismaClientError } from "@/config/db.js";
import type { Session } from "@prisma/client";

class SessionStore {
	async create(userId: Session["userId"], device: Session["device"]) {
		try {
			return await prisma.session.create({
				data: {
					user: {
						connect: {
							id: userId,
						},
					},
					device: device,
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteAll() {
		try {
			return await prisma.session.deleteMany();
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async updateDevice(sid: string, device: Session["device"]) {
		try {
			return await prisma.session.update({
				where: {
					id: sid,
				},
				data: {
					device: device,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async updateNotificationToken(sid: string, notificationToken: string) {
		try {
			return await prisma.session.update({
				where: {
					id: sid,
				},
				data: {
					notificationToken: notificationToken,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getNotificationTokensByUser(userId: string) {
		try {
			const tokenObjects = await prisma.session.findMany({
				where: {
					userId: userId,
					notificationToken: {
						not: null,
					},
					active: true,
				},
				select: {
					notificationToken: true,
				},
			});

			return tokenObjects.map((o) => o.notificationToken as string);
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getAllNotificationTokens() {
		try {
			const tokenObjects = await prisma.session.findMany({
				where: {
					notificationToken: {
						not: null,
					},
					active: true,
				},
				select: {
					notificationToken: true,
				},
			});

			return tokenObjects.map((o) => o.notificationToken as string);
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new SessionStore();

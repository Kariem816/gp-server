import { prisma, parsePrismaError } from "@/config/db.js";

import type { PrismaClientError } from "@/config/db.js";
import type { Upload } from "@prisma/client";

class UploadsStore {
	async index(): Promise<Upload[]> {
		try {
			// TODO: pagination
			return prisma.upload.findMany();
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async create(data: Partial<Upload>): Promise<Upload> {
		try {
			return await prisma.upload.create({
				data: {
					key: data.key!,
					url: data.url!,
					size: data.size!,
					name: data.name!,
					metadata: data.metadata!,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async show(key: string): Promise<Upload> {
		try {
			return prisma.upload.findUniqueOrThrow({
				where: {
					key,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async delete(key: string): Promise<Upload> {
		try {
			return prisma.upload.delete({
				where: {
					key,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async showByURL(url: string): Promise<Upload> {
		try {
			return prisma.upload.findUniqueOrThrow({
				where: {
					url,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteByURL(url: string): Promise<Upload> {
		try {
			return prisma.upload.delete({
				where: {
					url,
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteMany(keys: string[]): Promise<void> {
		try {
			await prisma.upload.deleteMany({
				where: {
					key: {
						in: keys,
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteManyByURL(urls: string[]): Promise<void> {
		try {
			await prisma.upload.deleteMany({
				where: {
					url: {
						in: urls,
					},
				},
			});
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async deleteAll(): Promise<void> {
		try {
			await prisma.upload.deleteMany();
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async getKey(url: Upload["url"]): Promise<Upload["key"]> {
		try {
			const { key } = await prisma.upload.findUniqueOrThrow({
				where: {
					url,
				},
				select: {
					key: true,
				},
			});

			return key;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new UploadsStore();
import { PrismaError, prisma } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import type { User, Controller, Camera } from "@prisma/client";

class ControllerStore {
	async getControllerById(id: Controller["id"]): Promise<Controller> {
		try {
			return await prisma.controller.findUniqueOrThrow({
				where: { id },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getControllerByUserId(id: User["id"]): Promise<Controller> {
		try {
			return await prisma.controller.findUniqueOrThrow({
				where: { userId: id },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateController(userId: User["id"], data: Partial<Controller>) {
		try {
			return await prisma.controller.update({
				where: {
					userId,
				},
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async createApiKey(
		id: Controller["id"],
		data: { key: string; name: string; expiresAt?: Date }
	) {
		try {
			return await prisma.apiKey.create({
				data: {
					...data,
					controller: {
						connect: { id },
					},
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getApiKey(key: string) {
		try {
			return await prisma.apiKey.findUniqueOrThrow({
				where: { key },
				include: {
					controller: {
						include: {
							user: true,
						},
					},
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getApiKeyById(id: string) {
		try {
			return await prisma.apiKey.findUniqueOrThrow({
				where: { id },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getApiKeysByControllerId(id: Controller["id"]) {
		try {
			return await prisma.apiKey.findMany({
				where: { controllerId: id },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getApiKeysByUserId(id: User["id"]) {
		try {
			return await prisma.apiKey.findMany({
				where: { controller: { userId: id } },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async rollApiKey(keyId: string) {
		try {
			return await prisma.apiKey.delete({
				where: { id: keyId },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getCameras(): Promise<Camera[]> {
		try {
			return await prisma.camera.findMany();
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getCamerasByLocation(location: string): Promise<Camera[]> {
		try {
			return await prisma.camera.findMany({
				where: { location },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async addCamera(camera: {
		location: string;
		ip: string;
		tcp?: boolean;
	}): Promise<Camera> {
		try {
			return await prisma.camera.create({
				data: camera,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateCamera(id: Camera["id"], data: Partial<Camera>) {
		try {
			return await prisma.camera.update({
				where: { id },
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async deleteCamera(id: Camera["id"]) {
		try {
			return await prisma.camera.delete({
				where: { id },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new ControllerStore();

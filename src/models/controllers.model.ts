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

	async getCamerasByLocation(location: string): Promise<Camera[]> {
		try {
			return await prisma.camera.findMany({
				where: { location },
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async addCamera(camera: { location: string; ip: string }): Promise<Camera> {
		try {
			return await prisma.camera.create({
				data: camera,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new ControllerStore();

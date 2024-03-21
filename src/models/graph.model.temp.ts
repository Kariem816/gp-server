import { prisma, PrismaError } from "@/config/db";

import type { PrismaClientError } from "@/config/db";
import { GraphData_Temp } from "@prisma/client";

class GraphModel_Temp {
	async index() {
		try {
			return await prisma.graphData_Temp.findMany();
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async exists(label: string) {
		try {
			return await prisma.graphData_Temp.findFirst({
				where: {
					label,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async show(id: number) {
		try {
			return await prisma.graphData_Temp.findUniqueOrThrow({
				where: {
					id,
				},
				include: {
					data: {
						take: 20,
						orderBy: {
							time: "desc",
						},
					},
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async create(data: Omit<GraphData_Temp, "id">) {
		try {
			return await prisma.graphData_Temp.create({
				data,
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async update(id: number, value: number) {
		try {
			return await prisma.graphData_Temp.update({
				where: {
					id,
				},
				data: {
					data: {
						create: {
							value,
						},
					},
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new GraphModel_Temp();

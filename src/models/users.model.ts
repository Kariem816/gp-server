import { prisma, PrismaError } from "@/config/db";
import { comparePassword, hashPassword } from "@/utils/hash";
import type { Controller, User } from "@prisma/client";
import type { PrismaClientError } from "@/config/db";

export type RegisterReturn = {
	id: string;
	username: string;
	name: string;
	role: string;
};
class UserStore {
	async createStudent(userData: User): Promise<RegisterReturn> {
		const hashedPassword = await hashPassword(userData.password);
		userData.password = hashedPassword;

		try {
			const user = await prisma.user.create({
				data: {
					...userData,
					role: "student",
					student: {
						create: {
							registerations: {
								create: undefined,
							},
						},
					},
				},
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
				},
			});

			return user;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async createTeacher(userData: User): Promise<RegisterReturn> {
		const hashedPassword = await hashPassword(userData.password);
		userData.password = hashedPassword;

		return prisma.user.create({
			data: {
				...userData,
				role: "teacher",
				teacher: {
					create: {
						courses: {
							create: undefined,
						},
					},
				},
			},
			select: {
				id: true,
				username: true,
				name: true,
				role: true,
			},
		});
	}

	async createController(
		userData: User,
		controller: {
			location?: Controller["location"];
			controls: Controller["controls"];
		}
	): Promise<RegisterReturn> {
		const hashedPassword = await hashPassword(userData.password);
		userData.password = hashedPassword;

		try {
			const user = await prisma.user.create({
				data: {
					...userData,
					role: "controller",
					controller: {
						create: controller,
					},
				},
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
				},
			});

			return user;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async createSecurity(userData: User): Promise<RegisterReturn> {
		try {
			const hashedPassword = await hashPassword(userData.password);
			userData.password = hashedPassword;

			const user = await prisma.user.create({
				data: {
					...userData,
					role: "security",
				},
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
				},
			});

			await prisma.security.create({
				data: {
					user: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			return user;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async authenticateUser(
		username: string,
		password: string
	): Promise<Omit<Omit<User, "password">, "encodedImageData">> {
		try {
			const user = await prisma.user.findUnique({
				where: {
					username,
				},
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
					img: true,
					liscencePlate: true,
					teacher: true,
					student: true,
					security: true,
					controller: true,
					password: true,
				},
			});

			if (!user) {
				throw new Error();
			}

			const isPasswordValid = await comparePassword(
				password,
				user.password
			);
			if (!isPasswordValid) {
				throw new Error();
			}

			const clensedUser = {
				id: user.id,
				username: user.username,
				name: user.name,
				role: user.role,
				img: user.img,
				liscencePlate: user.liscencePlate,
				teacher: user.teacher,
				student: user.student,
				security: user.security,
				controller: user.controller,
			};

			return clensedUser;
		} catch (err) {
			throw new Error("Invalid Credentials");
		}
	}

	async getUserById(id: string): Promise<Partial<User>> {
		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id,
				},
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
					img: true,
					liscencePlate: true,
					teacher: true,
					student: true,
					security: true,
					controller: true,
				},
			});

			return user;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getUserPasswordById(id: string): Promise<User["password"]> {
		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id,
				},
				select: {
					password: true,
				},
			});

			return user.password;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async index({
		page,
		limit,
		filters,
	}: {
		page: number;
		limit: number;
		filters: any;
	}): Promise<
		PaginatedResponse<Omit<Omit<User, "password">, "encodedImageData">>
	> {
		try {
			const total = await prisma.user.count({
				where: {
					...filters,
				},
			});
			const users = await prisma.user.findMany({
				where: {
					...filters,
				},
				skip: (page - 1) * limit,
				take: limit,
				select: {
					id: true,
					username: true,
					name: true,
					role: true,
					img: true,
					liscencePlate: true,
				},
			});

			return {
				data: users,
				page,
				limit,
				total,
			};
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateProfilePic(userId: string, img: string): Promise<User["img"]> {
		try {
			const { img: oldImg } = await prisma.user.findUniqueOrThrow({
				where: {
					id: userId,
				},
				select: {
					img: true,
				},
			});
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					img,
				},
			});
			return oldImg;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updatePassword(userId: string, newPassword: string): Promise<void> {
		try {
			const hashedPassword = await hashPassword(newPassword);
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					password: hashedPassword,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async deleteUser(userId: string): Promise<void> {
		try {
			await prisma.user.delete({
				where: {
					id: userId,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async getImgEncoding(userId: string): Promise<User["encodedImageData"]> {
		try {
			const user = await prisma.user.findUniqueOrThrow({
				where: {
					id: userId,
				},
				select: {
					encodedImageData: true,
				},
			});

			return user.encodedImageData;
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}

	async updateImgEncoding(
		userId: string,
		encodedImageData: User["encodedImageData"]
	): Promise<void> {
		try {
			await prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					encodedImageData,
				},
			});
		} catch (err) {
			throw new PrismaError(err as PrismaClientError);
		}
	}
}

export default new UserStore();

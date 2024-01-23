import { prisma, parsePrismaError, errCodesToMessages } from "@/config/db.js";
import { comparePassword, hashPassword } from "@/utils/hash.js";
import type { User } from "@prisma/client";
import type { PrismaClientError, PrismaError } from "@/config/db.js";

class UserStore {
	async createStudent(userData: User): Promise<User> {
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
				include: {
					student: true,
				},
			});

			return user;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async createTeacher(userData: User): Promise<User> {
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
			include: {
				teacher: true,
			},
		});
	}

	async createController(userData: User): Promise<User> {
		const hashedPassword = await hashPassword(userData.password);
		userData.password = hashedPassword;

		try {
			const user = await prisma.user.create({
				data: {
					...userData,
					role: "controller",
					controller: {
						create: {
							location: undefined,
						},
					},
				},
				include: {
					controller: true,
				},
			});

			return user;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async createSecurity(userData: User): Promise<User> {
		try {
			const hashedPassword = await hashPassword(userData.password);
			userData.password = hashedPassword;

			const user = await prisma.user.create({
				data: {
					...userData,
					role: "security",
				},
			});

			const security = await prisma.security.create({
				data: {
					user: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			//@ts-ignore
			return { ...user, security };
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async createAdmin(userData: User): Promise<User> {
		const adminCount = await prisma.user.count({
			where: { role: "admin" },
		});

		if (adminCount > 0) {
			throw new Error("Admin already exists");
		}

		const hashedPassword = await hashPassword(userData.password);
		userData.password = hashedPassword;

		try {
			const user = await prisma.user.create({
				data: {
					...userData,
					role: "admin",
				},
			});

			const admin = await prisma.admin.create({
				data: {
					user: {
						connect: {
							id: user.id,
						},
					},
				},
			});

			//@ts-ignore
			return { ...user, admin: admin };
		} catch (err: any) {
			if (err.message === "Admin already exists") {
				throw {
					httpStatus: 400,
					simpleMessage: "Admin already exists",
					longMessage: errCodesToMessages[400],
					originalError: err,
				} as PrismaError;
			}
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async authenticateUser(
		username: string,
		password: string
	): Promise<Omit<User, "password">> {
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
			throw {
				httpStatus: 401,
				simpleMessage: "Invalid Credentials",
				longMessage: errCodesToMessages[401],
				originalError: err,
			} as PrismaError;
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
	}): Promise<Omit<User, "password">[]> {
		try {
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

			return users;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
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
			throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new UserStore();

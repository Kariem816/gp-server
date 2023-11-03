import { prisma, parsePrismaError, errCodesToMessages } from "@/config/db";
import { comparePassword, hashPassword } from "@/utils/hash";
import type { User } from "@prisma/client";
import type { PrismaClientError, PrismaError } from "@/config/db";

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
							courses: {
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

			//@ts-ignore
			delete user.password;

			return user;
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
				},
			});

			return user;
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async index({
		page,
		count,
		filters,
	}: {
		page: number;
		count: number;
		filters: any;
	}): Promise<Omit<User, "password">[]> {
		try {
			console.log(filters);
			const users = await prisma.user.findMany({
				where: {
					...filters,
				},
				skip: (page - 1) * count,
				take: count,
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
}

export default new UserStore();

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
		const userCount = await prisma.user.count();
		if (userCount > 0) {
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
		} catch (err) {
			throw parsePrismaError(err as PrismaClientError);
		}
	}

	async authenticateUser(username: string, password: string): Promise<User> {
		try {
			const user = await prisma.user.findUnique({
				where: {
					username,
				},
			});

			if (!user) {
				throw new Error("Invalid Credentials");
			}

			const isPasswordValid = await comparePassword(
				password,
				user.password
			);
			if (!isPasswordValid) {
				throw new Error("Invalid Credentials");
			}

			return user;
		} catch (err) {
			throw {
				httpStatus: 401,
				simpleMessage: "Invalid Credentials",
				longMessage: errCodesToMessages[401],
				originalError: err,
			} as PrismaError;
			// throw parsePrismaError(err as PrismaClientError);
		}
	}
}

export default new UserStore();

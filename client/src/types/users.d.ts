type BaseUser = {
	id: string;
	username: string;
	name: string;
	password?: string;
	img: string;
};

interface MetaUser {
	id: string;
	userId: string;
}

export type Admin = BaseUser & {
	role: "admin";
	licensePlate: string;
};

export type Student = BaseUser & {
	role: "student";
	student: MetaUser & {
		courses: any[];
	};
};

export type Teacher = BaseUser & {
	role: "teacher";
	licensePlate: string;
	teacher: MetaUser & {
		courses: any[];
	};
};

export type Controller = BaseUser & {
	role: "controller";
	controller: MetaUser & {
		location: string;
		controls: string[];
	};
};

export type Security = BaseUser & {
	role: "security";
	security: MetaUser & {
		location: string;
	};
};

export type LoggedUser = Admin | Student | Teacher | Controller | Security;

export type GuestUser = {
	role: "guest";
};

export type User = LoggedUser | GuestUser;
export type UserRole = Exclude<User["role"], "guest">;

type RoleToUser<R extends UserRole> = Extract<User, { role: R }>;

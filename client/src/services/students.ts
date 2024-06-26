import { get } from "./api";
import type { APIQuery } from "~/types/query";

export type TStudentAttendance = {
	id: string;
	course: {
		id: string;
		name: string;
		code: string;
		_count: {
			lectures: number;
		};
	};
	attendance: {
		id: string;
		times: string[]; // ISO string
		lecture: {
			imgs: {
				id: string;
				capturedAt: string; // ISO string
			}[];
			id: string;
			courseId: string;
			time: string; // ISO string
			duration: number;
			ended: string | null; // ISO string
			location: string;
		};
	}[];
}[];

export type TRegistration = {
	student: {
		user: {
			id: string;
			name: string;
			img: string;
		};
	};
	course: {
		id: string;
		name: string;
		code: string;
		creditHours: number;
		lectures: {
			id: string;
			time: string; // ISO string
		}[];
	};
	id: string;
	semester: string;
	attendance: {
		id: string;
		times: string[]; // ISO string
		lecture: {
			imgs: {
				id: string;
				capturedAt: string; // ISO string
			}[];
			id: string;
			courseId: string;
			time: string; // ISO string
			duration: number;
			ended: string | null; // ISO string
			location: string;
		};
	}[];
};

export type TStudentCourse = {
	course: {
		id: string;
		name: string;
		code: string;
		creditHours: number;
	};
	semester: string;
};

export type TScheduleClass = {
	id: string;
	courseId: string;
	time: string; // ISO Date
	duration: number;
	ended: string | null; // ISO Date
	location: string;
	course: {
		id: string;
		name: string;
		code: string;
	};
};

export type TStudent = {
	id: string;
	user: {
		id: string;
		name: string;
		img: string;
	};
	registerations: {
		id: string;
		semester: string;
		course: {
			id: string;
			name: string;
			code: string;
		};
	}[];
};

export async function getMyCourses(
	query: APIQuery = {},
	page: number
): Promise<PaginatedResponse<TStudentCourse>> {
	return get("/students/my-courses", { ...query, page });
}

export async function getStudentCourses(
	studentId: string,
	query: APIQuery = {}
): Promise<PaginatedResponse<TStudentCourse>> {
	return get(`/students/${studentId}/courses`, query);
}

export async function getMySchedule(
	until: Date | undefined = undefined
): Promise<APIResponse<TScheduleClass[]>> {
	return get("/students/my-schedule", {
		until: until?.toISOString(),
	});
}

export async function getStudentSchedule(
	studentId: string,
	until: Date | undefined = undefined
): Promise<APIResponse<TScheduleClass[]>> {
	return get(`/students/${studentId}/schedule`, {
		until: until?.toISOString(),
	});
}

export async function getMyAttendance(
	semester: string | undefined = undefined
): Promise<APIResponse<TStudentAttendance>> {
	return get("/students/my-attendance", {
		semester,
	});
}

export async function getStudentAttendance(
	studentId: string,
	semester: string | undefined = undefined
): Promise<APIResponse<TStudentAttendance>> {
	return get(`/students/${studentId}/attendance`, {
		semester,
	});
}

export async function getStudent(id: string): Promise<APIResponse<TStudent>> {
	return get(`/students/${id}`);
}

export async function getCourseProfile(
	profileId: string
): Promise<APIResponse<TRegistration>> {
	return get(`/students/profile/${profileId}`);
}

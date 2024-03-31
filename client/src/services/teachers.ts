import { get } from "./api";

import type { APIQuery } from "~/types/query";

export type TeacherCourse = {
	id: string;
	name: string;
	code: string;
	_count: {
		students: number;
	};
};

export async function getTeachers(query?: APIQuery) {
	return get("/teachers", query);
}

export async function getMyLectures() {
	return get("/teachers/mylectures");
}

export async function getTeacher(id: string) {
	return get(`/teachers/${id}`);
}

export async function getMyCourses(): Promise<APIResponse<TeacherCourse[]>> {
	return get("/teachers/mycourses");
}

export async function getTeacherCourses(id: string) {
	return get(`/teachers/${id}/courses`);
}

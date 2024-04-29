import { get } from "./api";

import type { APIQuery } from "~/types/query";
import { Teacher } from "./courses";

export type TeacherCourse = {
	id: string;
	name: string;
	code: string;
	_count: {
		students: number;
	};
};

export type TeacherLecture = {
	id: string;
	time: string; // ISO date
	duration: number;
	location: string;
	ended: string | null; // ISO date
	course: {
		id: string;
		name: string;
		code: string;
	};
	_count: {
		attendees: number;
	};
};

export async function getTeachers(
	query?: APIQuery
): Promise<APIResponse<Teacher[]>> {
	return get("/teachers", query);
}

export async function getMyLectures(): Promise<APIResponse<TeacherLecture[]>> {
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

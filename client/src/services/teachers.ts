import { get } from "./api";

import type { APIQuery } from "~/types/query";
import { Teacher as TeacherUser } from "./courses";

export type Teacher = {
	id: string;
	user: {
		id: string;
		name: string;
		email: string;
		img: string;
	};
	courses: {
		id: string;
		name: string;
		code: string;
	}[];
};

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
): Promise<APIResponse<TeacherUser[]>> {
	return get("/teachers", query);
}

export async function getMyLectures(): Promise<APIResponse<TeacherLecture[]>> {
	return get("/teachers/mylectures");
}

export async function getTeacher(id: string): Promise<APIResponse<Teacher>> {
	return get(`/teachers/${id}`);
}

export async function getMyCourses(): Promise<APIResponse<TeacherCourse[]>> {
	return get("/teachers/mycourses");
}

export async function getTeacherCourses(
	id: string
): Promise<APIResponse<TeacherCourse[]>> {
	return get(`/teachers/${id}/courses`);
}

import { del, get, post, put } from "./api";

import type { APIQuery } from "~/types/query";

export type CreateCourse = {
	name: string;
	code: string;
	creditHours: number;
	content?: string;
};

export type UpdateCourse = {
	name?: string;
	code?: string;
	creditHours?: number;
	content?: string;
};

export type TCourseListing = {
	id: string;
	name: string;
	code: string;
	creditHours: number;
	teachers: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			img: string;
		};
	}[];
	_count: {
		students: number;
	};
};

export type CreateLectureData = {
	time: number; // Unix Timestamp
	duration: number;
	location: string;
};

export async function getCourses(
	query: APIQuery = {}
): Promise<PaginatedResponse<TCourseListing>> {
	return get("/courses", query);
}

export async function getCourse(id: string) {
	return get(`/courses/${id}`);
}

export async function createCourse(data: CreateCourse) {
	return post("/courses", data);
}

export async function updateCourse(id: string, data: UpdateCourse) {
	return put(`/courses/${id}`, data);
}

export async function deleteCourse(id: string) {
	return del(`/courses/${id}`);
}

export async function addTeachersToCourse(
	id: string,
	teacherIds: string | string[]
) {
	return post(`/courses/${id}/teachers`, { teacherId: teacherIds });
}

export async function removeTeachersFromCourse(
	id: string,
	teacherIds: string | string[]
) {
	return del(`/courses/${id}/teachers`, { teacherId: teacherIds });
}

export async function updateCourseTeachers(
	id: string,
	added: string[],
	removed: string[]
) {
	return put(`/courses/${id}/teachers`, {
		addedTeachers: added,
		removedTeachers: removed,
	});
}

export async function isRegisteredInCourse(id: string) {
	return get(`/courses/${id}/mystatus`);
}

export async function registerCourse(id: string) {
	return post(`/courses/${id}/register`);
}

export async function unregisterCourse(id: string) {
	return post(`/courses/${id}/unregister`);
}

/**
 *
 * Don't Use This. Not Implemented Yet
 */
export async function getCourseStudents(id: string, query?: APIQuery) {
	return get(`/courses/${id}/students`, query);
}

/**
 *
 * Don't Use This. Not Implemented Yet
 */
export async function getCourseTeachers(id: string) {
	return get(`/courses/${id}/teachers`);
}

export async function getCourseLectures(id: string) {
	return get(`/courses/${id}/lectures`);
}

export async function createCourseLecture(id: string, data: CreateLectureData) {
	return post(`/courses/${id}/lectures`, data);
}

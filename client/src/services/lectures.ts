import { get, post, put, del } from "./api";

import type { APIQuery } from "~/types/query";
import type { CreateLectureData } from "./courses";

export type TLecture = {
	id: string;
	courseId: string;
	location: string;
	time: string;
	duration: number;
	ended: string | null;
	course: {
		id: string;
		name: string;
		code: string;
	};
	_count: {
		attendees: number;
	};
};

export type TAttendee = {
	times: string[];
	student: {
		id: string;
		studentId: string;
		student: {
			id: string;
			userId: string;
			user: {
				id: string;
				name: string;
				img: string;
			};
		};
	};
};

export type TAbsentee = {
	id: string;
	student: {
		id: string;
		userId: string;
		user: {
			id: string;
			name: string;
			img: string;
		};
	};
};

export async function getLecture(
	lectureId: string,
	query: APIQuery = {}
): Promise<APIResponse<TLecture>> {
	return get(`/lectures/${lectureId}`, query);
}

export async function editLecture(
	lectureId: string,
	data: Partial<CreateLectureData>
) {
	return put(`/lectures/${lectureId}`, data);
}

export async function deleteLecture(lectureId: string): Promise<void> {
	return del(`/lectures/${lectureId}`);
}

export async function finishLecture(lectureId: string): Promise<void> {
	return post(`/lectures/${lectureId}/finish`);
}

export async function getLectureAttendees(
	lectureId: string,
	query?: APIQuery
): Promise<PaginatedResponse<TAttendee>> {
	return get(`/lectures/${lectureId}/attendees`, query);
}

export async function getLectureAbsentees(
	lectureId: string,
	query?: APIQuery
): Promise<PaginatedResponse<TAbsentee>> {
	return get(`/lectures/${lectureId}/absentees`, query);
}

export async function addLectureAttendees(lectureId: string, data: any) {
	return post(`/lectures/${lectureId}/attendees`, data);
}

export async function removeLectureAttendees(lectureId: string, data: any) {
	return del(`/lectures/${lectureId}/attendees`, data);
}

export async function getLectureImgs(
	lectureId: string,
	query?: APIQuery
): Promise<
	PaginatedResponse<{
		id: string;
		img: string;
		capturedAt: string;
		students: number;
		faces: number;
		processed: boolean;
	}>
> {
	return get(`/lectures/${lectureId}/imgs`, query);
}

import { AttendedLecture } from "./attended-lecture";

import type { TStudentAttendance } from "~/services/students";

export function AttendedCourse({
	attendance,
}: {
	attendance: TStudentAttendance[number]["attendance"];
}) {
	return (
		<div className="space-y-4">
			{attendance.map((aLecture) => (
				<AttendedLecture key={aLecture.id} {...aLecture} />
			))}
		</div>
	);
}

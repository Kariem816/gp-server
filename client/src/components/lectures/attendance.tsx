import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "~/contexts/translation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AttendanceGraph } from "~/components/attendance/graph";
import { calculateAttendance } from "~/helpers/attendance";

import type { TAttendee, TLecture } from "~/services/lectures";

export function LectureAttendance({
	lecture,
	attendees,
}: {
	lecture: TLecture;
	attendees: TAttendee[];
}) {
	const { t } = useTranslation();
	const sortedAttendees = useMemo(() => {
		return attendees.sort((a, b) => {
			return b.times.length - a.times.length;
		});
	}, [attendees]);

	return attendees.length > 0 ? (
		<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
			{sortedAttendees.map((attendee) => (
				<Attendee
					key={attendee.student.id}
					student={attendee.student.student}
					times={attendee.times.map((time) => new Date(time))}
					lecture={lecture}
				/>
			))}
		</div>
	) : (
		<div className="my-36 grid place-items-center">
			<p className="italic">{t("no_attendance")}</p>
		</div>
	);
}

function Attendee({
	student,
	times,
	lecture,
}: {
	student: TAttendee["student"]["student"];
	times: Date[];
	lecture: TLecture;
}) {
	const queryClient = useQueryClient();

	const timeline = useMemo(() => {
		// TODO: why does this work?
		const queryData = queryClient.getQueriesData({
			queryKey: ["lecture-imgs", lecture.id],
		});
		const data = queryData
			.flatMap((d) => d[1])
			.flatMap((d: any) => d.pages)
			.map((d: any) => d.data)
			.flat();

		const imgs = data.map((d: any) => new Date(d.capturedAt));

		const start = new Date(lecture.time);
		const end = lecture.ended
			? new Date(lecture.ended)
			: new Date(start.getTime() + lecture.duration * 60 * 1000);

		return {
			start,
			end,
			imgs,
		};
	}, [lecture, queryClient]);

	const attendance = useMemo(() => {
		return calculateAttendance(
			timeline.start,
			timeline.end,
			times.map((t) => new Date(t))
		);
	}, [times, timeline]);

	return (
		<div className="border rounded-md shadow-md p-4 space-y-4">
			<div className="flex items-center gap-2">
				<Avatar>
					<AvatarImage
						src={student.user.img}
						alt={student.user.name}
					/>
					<AvatarFallback>{student.user.name[0]}</AvatarFallback>
				</Avatar>

				<span>{student.user.name}</span>
			</div>

			<AttendanceGraph
				times={times}
				periods={attendance.periods}
				timeline={timeline}
				percentage={attendance.percentage}
			/>
		</div>
	);
}

import { useTranslation } from "~/contexts/translation";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getCourseStudents } from "~/services/courses";
import { Spinner } from "~/components/loaders";
import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCourseProfile } from "~/services/students";
import { calculateAttendance } from "~/helpers/attendance";
import { dateTime } from "~/utils/formatters/time";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";

import type { TRegistration } from "~/services/students";
import type { CourseStudent } from "~/services/courses";

export function CourseStudents({ courseId }: { courseId: string }) {
	const { t } = useTranslation();
	const {
		data: students,
		isLoading,
		isError,
		error,
		total,
	} = usePaginatedQuery({
		queryKey: ["course-students", courseId],
		queryFn: (pagination) => getCourseStudents(courseId, pagination),
		options: {
			initialLimit: 12,
			initialPage: 1,
		},
	});

	const courseName = useMemo(() => {
		if (!students || students.length === 0) return "";
		const course = students[0].student.registerations.find(
			(reg) => reg.course.id === courseId
		)!.course;

		return course.name;
	}, [students, courseId]);

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isLoading || !students) {
		return (
			<div className="my-12 grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="space-y-4 py-2">
			<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
				{students.map((student) => (
					<StudentRegistration
						key={student.id}
						registration={student}
						courseName={courseName}
					/>
				))}
			</div>

			{students.length === 0 && (
				<p className="text-center italic">{t("no_students")}</p>
			)}

			{total > 5 && (
				<div className="flex justify-end">
					<Link to="/courses/$id/students" params={{ id: courseId }}>
						<Button variant="outline">
							<PlusIcon className="me-2 size-4" />
							{t("all")}
						</Button>
					</Link>
				</div>
			)}
		</div>
	);
}

export function StudentRegistration({
	registration,
	courseName,
}: {
	registration: CourseStudent;
	courseName: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<div className="rounded-xl p-4 bg-accent flex items-center justify-between gap-4 flex-wrap">
					<div className="flex gap-4 items-center">
						<Avatar>
							<AvatarImage
								src={registration.student.user.img}
								alt={registration.student.user.name}
							/>
							<AvatarFallback>
								{registration.student.user.name[0]}
							</AvatarFallback>
						</Avatar>
						<Link
							to="/students/$id"
							params={{ id: registration.studentId }}
							className="font-semibold hover:underline"
						>
							{registration.student.user.name}
						</Link>
					</div>
					<span>{registration.semester}</span>
				</div>
			</DialogTrigger>
			<DialogContent>
				<StudentInfo
					registration={registration}
					courseName={courseName}
				/>
			</DialogContent>
		</Dialog>
	);
}

function StudentInfo({
	registration,
	courseName,
}: {
	registration: CourseStudent;
	courseName: string;
}) {
	const { t } = useTranslation();
	const {
		data: profile,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ["student-profile", registration.id],
		queryFn: () => getCourseProfile(registration.id),
		select: (data) => data.data,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isPending) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	const pastLectures = profile.course.lectures.filter(
		(lecture) => new Date(lecture.time) < new Date()
	);

	const absence = pastLectures.filter(
		(lecture) =>
			!profile.attendance.some((att) => att.lecture.id === lecture.id)
	);

	return (
		<>
			<DialogHeader>
				<DialogTitle>{t("student_info")}</DialogTitle>
			</DialogHeader>
			<div>
				<div className="flex items-center flex-wrap gap-4">
					<h3 className="text-xl text-primary">{t("course")}</h3>
					<span className="text-lg font-semibold">{courseName}</span>
				</div>
				<div className="flex items-center flex-wrap gap-4">
					<h3 className="text-xl text-primary">{t("student")}</h3>
					<span className="text-lg font-semibold">
						{registration.student.user.name}
					</span>
				</div>

				<Accordion type="single" collapsible>
					<AccordionItem value="attendance">
						<AccordionTrigger className="p-0">
							<div className="flex justify-between items-center gap-4">
								<h3 className="text-xl text-primary m-0">
									{t("attendance")}
								</h3>
								<span>
									{profile.attendance.length} /{" "}
									{pastLectures.length}
									{pastLectures.length !== 0 && (
										<>
											(
											{Math.round(
												(profile.attendance.length /
													pastLectures.length) *
													100
											)}
											%
										</>
									)}
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="px-4 divide-y-2">
								{profile.attendance.map((attendance) => (
									<StudentInfoLecture
										key={attendance.id}
										attendance={attendance}
									/>
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="absence">
						<AccordionTrigger className="p-0">
							<div className="flex justify-between items-center gap-4">
								<h3 className="text-xl text-primary m-0">
									{t("absence")}
								</h3>
								<span>
									{absence.length} / {pastLectures.length}
									{pastLectures.length !== 0 && (
										<>
											(
											{Math.round(
												(absence.length /
													pastLectures.length) *
													100
											)}
											%
										</>
									)}
								</span>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="px-4 divide-y-2">
								{absence.map((ab) => (
									<StudentInfoAbsence absence={ab} />
								))}
							</div>
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
		</>
	);
}

function StudentInfoLecture({
	attendance,
}: {
	attendance: TRegistration["attendance"][0];
}) {
	const { t, language } = useTranslation();
	const { percentage } = useMemo(() => {
		const start = new Date(attendance.lecture.time);
		const end = attendance.lecture.ended
			? new Date(attendance.lecture.ended)
			: new Date(
					start.getTime() + attendance.lecture.duration * 60 * 1000
				);
		return calculateAttendance(
			start,
			end,
			attendance.times.map((t) => new Date(t))
		);
	}, [attendance]);

	return (
		<div className="flex items-center gap-4">
			<span>{dateTime(attendance.lecture.time, language)}</span>
			<span>
				{attendance.times.length === 0
					? t("manual_attendance")
					: percentage.toFixed(2) + "%"}
			</span>
		</div>
	);
}

function StudentInfoAbsence({
	absence,
}: {
	absence: TRegistration["course"]["lectures"][0];
}) {
	const { language } = useTranslation();
	return (
		<div>
			<span>{dateTime(absence.time, language)}</span>
		</div>
	);
}

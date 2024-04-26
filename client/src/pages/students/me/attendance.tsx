import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { AttendedCourse } from "~/components/dashboard/student/attended-course";
import { Spinner } from "~/components/loaders";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "~/components/ui/accordion";
import { useTranslation } from "~/contexts/translation";
import { getMyAttendance } from "~/services/students";

export const Route = createFileRoute("/students/me/attendance")({
	component: MyAttendance,
});

function MyAttendance() {
	const { t } = useTranslation();

	const {
		data: attendedCourses,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["student-attendance"],
		queryFn: () => getMyAttendance(),
		select: (data) => data.data,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			<div className="xs:flex xs:justify-end gap-2 items-center">
				<p className="font-semibold">{t("showing_curr_attendance")}</p>
			</div>

			{isLoading || !attendedCourses ? (
				<div className="h-full grid place-items-center">
					<Spinner />
				</div>
			) : attendedCourses.length > 0 ? (
				<Accordion type="single" collapsible>
					{attendedCourses.map((attendedCourse) => (
						<AccordionItem
							value={attendedCourse.id}
							key={attendedCourse.id}
						>
							<AccordionTrigger className="gap-4">
								<div className="flex justify-between items-center gap-4 flex-grow">
									<h6 className="text-xl font-semibold">
										{attendedCourse.course.name}
									</h6>
									<span>
										{attendedCourse.attendance.length}/
										{attendedCourse.course._count.lectures}
									</span>
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<AttendedCourse
									attendance={attendedCourse.attendance}
								/>
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			) : (
				<div className="py-12">
					<p className="text-center opacity-75 italic">
						{t("no_attendance")}
					</p>
				</div>
			)}
		</div>
	);
}

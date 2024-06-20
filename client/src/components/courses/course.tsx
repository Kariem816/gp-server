import { Link } from "@tanstack/react-router";
import { useTranslation } from "~/contexts/translation";
import { SignedInAs } from "~/components/auth";
import { Button } from "~/components/ui/button";
import { CourseTeachers } from "./course-teachers";
import { EditCourse } from "./edit-course";
import { DeleteCourse } from "./delete-course";
import { RegisterButton } from "./register-btn";
import { CreateLecture } from "./create-lecture";
import { CourseLectures } from "./course-lectures";
import { CourseStudents } from "./course-students";

import type { Course as TCourse } from "~/services/courses";

export function Course({ course }: { course: TCourse }) {
	const { t, isRTL } = useTranslation();

	return (
		<div className="container space-y-4 pb-12">
			<div className="space-y-1">
				<div className="flex justify-between items-center flex-wrap gap-4">
					<div>
						<h1 className="mb-0">{course.name}</h1>
						<p className="opacity-50">
							<span>{course.code}</span>
							<span> - </span>
							{isRTL ? (
								<>
									<span>
										{t("credit_hours")} {course.creditHours}
									</span>
								</>
							) : (
								<>
									<span>
										{course.creditHours} {t("credit_hours")}
									</span>
								</>
							)}
						</p>
					</div>
					<SignedInAs role="student">
						<RegisterButton course={course} />
					</SignedInAs>
				</div>
			</div>

			<div className="space-y-2">
				<h4 className="font-semibold text-lg text-primary">
					{t("course_content")}
				</h4>
				{course.content ? (
					<p>{course.content}</p>
				) : (
					<p className="text-center italic">{t("no_content")}</p>
				)}
			</div>

			<div className="space-y-2">
				<div className="flex justify-between items-center flex-wrap">
					<h4 className="font-semibold text-lg text-primary">
						{t("course_teachers")}
					</h4>
					<SignedInAs role="admin">
						<Link
							to="/courses/$id/teachers"
							params={{ id: course.id }}
						>
							<Button variant="outline">{t("manage")}</Button>
						</Link>
					</SignedInAs>
				</div>
				<CourseTeachers teachers={course.teachers} />
			</div>

			<div className="space-y-2">
				<div className="flex gap-4 items-center">
					<h4 className="font-semibold text-lg text-primary">
						{t("course_students")}
					</h4>
					<span className="font-semibold text-lg">
						{course._count.students}
					</span>
				</div>
				<SignedInAs role={["admin", "teacher"]}>
					<CourseStudents courseId={course.id} />
				</SignedInAs>
			</div>

			<SignedInAs role={["admin", "teacher"]}>
				<div className="space-y-2">
					<div className="flex justify-between items-center">
						<h4 className="font-semibold text-lg text-primary">
							{t("course_lectures")}
						</h4>
						<CreateLecture courseId={course.id} />
					</div>
					<CourseLectures courseId={course.id} />
				</div>
			</SignedInAs>

			<SignedInAs role="admin">
				<div className="flex gap-2 justify-end flex-wrap">
					<EditCourse course={course} />
					<DeleteCourse course={course} />
				</div>
			</SignedInAs>
		</div>
	);
}

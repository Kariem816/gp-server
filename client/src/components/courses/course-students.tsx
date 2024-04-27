import { useTranslation } from "~/contexts/translation";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { CourseStudent, getCourseStudents } from "~/services/courses";
import { Spinner } from "~/components/loaders";
import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

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
					<Lecture key={student.id} registration={student} />
				))}
			</div>

			{students.length === 0 && (
				<p className="text-center italic">{t("no_students")}</p>
			)}

			{total > 5 && (
				<div className="flex justify-end">
					<Link to="/courses/$id/lectures" params={{ id: courseId }}>
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

function Lecture({ registration }: { registration: CourseStudent }) {
	return (
		<Link to="/students/$id" params={{ id: registration.studentId }}>
			<div className="rounded-xl p-4 bg-accent flex items-center justify-between gap-4">
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
					<span className="font-semibold">
						{registration.student.user.name}
					</span>
				</div>
				<span>{registration.semester}</span>
			</div>
		</Link>
	);
}

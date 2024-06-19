import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import ProfilePic from "~/components/profile/profile-pic";
import { useTranslation } from "~/contexts/translation";
import { getTeacher } from "~/services/teachers";

import type { Teacher as TTeacher } from "~/services/teachers";

export const Route = createFileRoute("/teachers/$id")({
	component: TeacherPage,
});

function TeacherPage() {
	const { id: teacherId } = Route.useParams();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["teacher", teacherId],
		queryFn: () => getTeacher(teacherId),
		select: (data) => data.data,
	});

	if (isError) {
		return (
			<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
				{error.message}
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex justify-center items-center">
				<Spinner />
			</div>
		);
	}

	return <Teacher teacher={data!} />;
}

function Teacher({ teacher }: { teacher: TTeacher }) {
	const { t } = useTranslation();

	return (
		<div className="container p-4">
			<div className="grid place-items-center">
				<ProfilePic
					img={teacher.user.img}
					name={teacher.user.name}
					isCurrentUser={false}
				/>
				<h1 className="text-center text-2xl font-semibold">
					{teacher.user.name}
				</h1>
			</div>

			<div className="space-y-4">
				<h3 className="text-2xl">{t("courses")}</h3>
				{teacher.courses.length > 0 ? (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{teacher.courses.map((course) => (
							<Link
								key={course.id}
								to="/courses/$id"
								params={{ id: course.id }}
								className="border shadow-md rounded-md p-2 space-y-1"
							>
								<h4 className="text-lg font-semibold">
									{course.name}
								</h4>
								<p className="text-neutral-600">
									{course.code}
								</p>
							</Link>
						))}
					</div>
				) : (
					<h4 className="text-neutral-600 italic font-semibold">
						{t("no_courses")}
					</h4>
				)}
			</div>
		</div>
	);
}

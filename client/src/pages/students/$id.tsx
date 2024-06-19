import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import ProfilePic from "~/components/profile/profile-pic";
import { useTranslation } from "~/contexts/translation";
import { getStudent } from "~/services/students";

import type { TStudent } from "~/services/students";

export const Route = createFileRoute("/students/$id")({
	component: StudentPage,
});

function StudentPage() {
	const { id: studentId } = Route.useParams();
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["student", studentId],
		queryFn: () => getStudent(studentId),
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

	return <Student student={data!} />;
}

function Student({ student }: { student: TStudent }) {
	const { t } = useTranslation();

	return (
		<div className="container p-4">
			<div className="grid place-items-center">
				<ProfilePic
					img={student.user.img}
					name={student.user.name}
					isCurrentUser={false}
				/>
				<h1 className="text-center text-2xl font-semibold">
					{student.user.name}
				</h1>
			</div>

			<div className="space-y-4">
				<h3 className="text-2xl">{t("registrations")}</h3>
				{student.registerations.length > 0 ? (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{student.registerations.map((registration) => (
							<Link
								key={registration.id}
								to="/courses/$id"
								params={{ id: registration.course.id }}
								className="border shadow-md rounded-md p-2 flex flex-col gap-2"
							>
								<h4 className="text-lg font-semibold">
									{registration.course.name}
								</h4>
								<div className="flex-1 flex justify-between items-end gap-4 flex-wrap">
									<p className="text-neutral-600">
										{registration.course.code}
									</p>
									<p className="text-neutral-600">
										{registration.semester}
									</p>
								</div>
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

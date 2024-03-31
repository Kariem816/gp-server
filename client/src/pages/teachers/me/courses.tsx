import { useTranslation } from "~/contexts/translation";
import { TeacherCourse, getMyCourses } from "~/services/teachers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCourseLecture } from "~/services/courses";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Spinner } from "~/components/loaders";
import { Button } from "~/components/ui/button";
import LectureModal, { InternalLectureData } from "~/components/lectures/modal";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/teachers/me/courses")({
	component: MyCourses,
});

function MyCourses() {
	const { t } = useTranslation();

	const {
		data: courses,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["my-courses"],
		queryFn: () => getMyCourses(),
		select: (data) => data?.data ?? [],
	});

	if (isError) {
		return (
			<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
				{error.message}
			</div>
		);
	}

	return (
		<div className="h-full">
			{isLoading || !courses ? (
				<div className="flex justify-center items-center">
					<Spinner />
				</div>
			) : courses.length > 0 ? (
				<ul className="overflow-y-auto p-2">
					{courses.map((course) => (
						<li key={course.id}>
							<Course {...course} />
						</li>
					))}
				</ul>
			) : (
				<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
					{t("no_courses")}
				</div>
			)}
		</div>
	);
}

function Course({ id, name, code, _count }: TeacherCourse) {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const createLectureMutation = useMutation({
		mutationFn: (data: InternalLectureData) =>
			createCourseLecture(id, {
				...data,
				time: data.time.valueOf(),
			}),
		onSuccess: async () => {
			toast.success(t("lecture_created"));
			setOpen(false);
			await queryClient.invalidateQueries({
				queryKey: ["teacher-lectures"],
			});
		},
		onError: (err: any) => {
			toast.error(
				err.message ??
					err?.messages?.[0].message ??
					t("create_lecture_error")
			);
		},
	});

	return (
		<div className="border-2 border-primary rounded-xl">
			<div className="p-4">
				<h4 className="font-semibold text-xl">
					<Link
						to="/courses/$id"
						params={{ id }}
						className="hover:underline"
					>
						{name}
					</Link>
				</h4>
				<div className="text-primary">{code}</div>
				<Link to="/courses/$id/students" params={{ id }}>
					{_count.students} {t("students")}
				</Link>
				<div className="flex justify-end gap-4">
					<LectureModal
						open={open}
						setOpen={setOpen}
						Btn={
							<Button variant="outline">
								{t("create_lecture")}
							</Button>
						}
						onSubmit={createLectureMutation.mutateAsync}
						title={t("create_lecture")}
						isDisabled={createLectureMutation.isPending}
					/>
				</div>
			</div>
		</div>
	);
}

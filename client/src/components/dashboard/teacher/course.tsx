import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import LectureModal, { InternalLectureData } from "~/components/lectures/modal";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { createCourseLecture } from "~/services/courses";
import { TeacherCourse } from "~/services/teachers";

export function Course({ id, name, code, _count }: TeacherCourse) {
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

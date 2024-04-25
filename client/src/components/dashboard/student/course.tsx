import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { unregisterCourse } from "~/services/courses";
import type { TStudentCourse } from "~/services/students";

export function Course({ course: registration }: { course: TStudentCourse }) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const unregisterCourseMutation = useMutation({
		mutationFn: () => unregisterCourse(registration.course.id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["student", "courses"],
			});
			toast.success(t("unregister_success"), {
				description: t(
					"unregistered_course_description",
					registration.course.name
				),
			});
		},
	});

	return (
		<div className="border-2 border-primary rounded-xl p-4 space-y-4">
			<h4 className="font-semibold text-xl">
				{registration.course.name}
			</h4>
			<div className="flex justify-between items-center">
				<span className="text-primary">{registration.course.code}</span>
				<span>{registration.semester}</span>
			</div>
			<div className="flex justify-end gap-4">
				<Button
					variant="destructive"
					disabled={unregisterCourseMutation.isPending}
					onClick={() => unregisterCourseMutation.mutateAsync()}
				>
					{t("unregister_course")}
				</Button>
				<Link to="/courses/$id" params={{ id: registration.course.id }}>
					<Button>{t("view_course")}</Button>
				</Link>
			</div>
		</div>
	);
}

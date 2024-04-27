import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useTranslation } from "~/contexts/translation";
import {
	isRegisteredInCourse,
	registerCourse,
	unregisterCourse,
} from "~/services/courses";
import { Button } from "~/components/ui/button";

import type { Course as TCourse } from "~/services/courses";

export function RegisterButton({ course }: { course: TCourse }) {
	const { t } = useTranslation();
	const { data, isError, error } = useQuery({
		queryKey: ["course-status", course.id],
		queryFn: () => isRegisteredInCourse(course.id),
		select: (data) => data.data,
	});
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const registerCourseMutation = useMutation({
		mutationFn: () => registerCourse(course.id),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ["course-status", course.id, "course"],
			});
			const previousStatus = queryClient.getQueryData([
				"course-status",
				course.id,
			]);
			queryClient.setQueryData(["course-status", course.id], {
				data: {
					status: true,
				},
			});
			const previousCourse = queryClient.getQueryData([
				"course",
				course.id,
			]) as APIResponse<TCourse>;
			queryClient.setQueryData(["course", course.id], {
				data: {
					...previousCourse.data,
					_count: {
						students: previousCourse.data._count.students + 1,
					},
				},
			});
			return { previousStatus, previousCourse };
		},
		onError: (_err, _, context) => {
			queryClient.setQueryData(
				["course-status", course.id],
				context?.previousStatus
			);
			queryClient.setQueryData(
				["course", course.id],
				context?.previousCourse
			);
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["course-status", course.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", course.id],
			});
		},
	});

	const unregisterCourseMutation = useMutation({
		mutationFn: () => unregisterCourse(course.id),
		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: ["course-status", course.id, "course"],
			});
			const previousStatus = queryClient.getQueryData([
				"course-status",
				course.id,
			]);
			queryClient.setQueryData(["course-status", course.id], {
				data: {
					status: false,
				},
			});
			const previousCourse = queryClient.getQueryData([
				"course",
				course.id,
			]) as APIResponse<TCourse>;
			queryClient.setQueryData(["course", course.id], {
				data: {
					...previousCourse.data,
					_count: {
						students: previousCourse.data._count.students - 1,
					},
				},
			});
			return { previousStatus, previousCourse };
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["course-status", course.id],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", course.id],
			});
		},
	});

	async function handleSubmit() {
		try {
			if (data?.status) {
				await unregisterCourseMutation.mutateAsync();
			} else {
				await registerCourseMutation.mutateAsync();
			}
			toast.success(
				data?.status ? t("unregister_success") : t("register_success"),
				{
					description: t(
						data?.status
							? "unregistered_course_description"
							: "registered_course_description",
						course.name
					),
					action: {
						label: t("dashboard"),
						onClick: () => navigate({ to: "/students/me" }),
					},
				}
			);
		} catch (err: any) {
			toast.error(err.message);
		}
	}

	if (isError) {
		console.error(error);
		return null;
	}

	return (
		<Button onClick={handleSubmit}>
			{data?.status ? t("unregister_course") : t("register_course")}
		</Button>
	);
}

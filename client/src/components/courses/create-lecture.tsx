import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "~/contexts/translation";
import { createCourseLecture } from "~/services/courses";
import LectureModal from "~/components/lectures/modal";
import { Button } from "~/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

import type { InternalLectureData } from "~/components/lectures/modal";

export function CreateLecture({ courseId }: { courseId: string }) {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const createLectureMutation = useMutation({
		mutationFn: (data: InternalLectureData) =>
			createCourseLecture(courseId, {
				...data,
				time: data.time.valueOf(),
			}),
		onSuccess: async () => {
			toast.success(t("lecture_created"));
			setOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["teacher-lectures"],
			});
			queryClient.invalidateQueries({
				queryKey: ["course-lectures", courseId],
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
		<LectureModal
			open={open}
			setOpen={setOpen}
			Btn={
				<Button variant="outline">
					<PlusIcon className="text-primary xs:me-2" />
					<span className="hidden xs:inline">
						{t("create_lecture")}
					</span>
				</Button>
			}
			onSubmit={createLectureMutation.mutateAsync}
			title={t("create_lecture")}
			isDisabled={createLectureMutation.isPending}
		/>
	);
}

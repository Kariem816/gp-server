import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { useTranslation } from "~/contexts/translation";
import { deleteLecture, editLecture, finishLecture } from "~/services/lectures";
import { StopwatchIcon, TrashIcon, Pencil2Icon } from "@radix-ui/react-icons";
import LectureModal from "~/components/lectures/modal";
import { useState } from "react";

import type { InternalLectureData } from "~/components/lectures/modal";

export function FinishLectureModal({
	id,
	disabled,
}: {
	id: string;
	disabled: boolean;
}) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const endLectureMutation = useMutation({
		mutationFn: () => finishLecture(id),
		onSuccess: () => {
			toast.success(t("lecture_ended"));
			queryClient.invalidateQueries({
				queryKey: ["teacher-lectures"],
			});
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon" disabled={disabled}>
					<StopwatchIcon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("end_lecture")}</DialogTitle>
					<DialogDescription>
						{t("end_lecture_confirm")}
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end items-center gap-4">
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					<Button
						onClick={() => endLectureMutation.mutateAsync()}
						variant="destructive"
						disabled={endLectureMutation.isPending}
					>
						{t("end_lecture")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export function EditLectureModal({
	id,
	initialData,
	disabled,
	courseId,
}: {
	id: string;
	initialData: InternalLectureData;
	disabled: boolean;
	courseId: string;
}) {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const editLectureMutation = useMutation({
		mutationFn: (data: InternalLectureData) =>
			editLecture(id, {
				...data,
				time: data.time.valueOf(),
			}),
		onSuccess: () => {
			toast.success(t("lecture_updated"));
			setOpen(false);
			queryClient.invalidateQueries({
				queryKey: ["teacher-lectures"],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", courseId],
			});
			queryClient.invalidateQueries({
				queryKey: ["course-lectures", courseId],
			});
		},
		onError: (err: any) => {
			toast.error(
				err.message ??
					err?.messages?.[0].message ??
					t("edit_lecture_error")
			);
		},
	});

	return (
		<LectureModal
			open={open}
			setOpen={setOpen}
			initialData={initialData}
			onSubmit={editLectureMutation.mutateAsync}
			title="edit_lecture"
			Btn={
				<Button size="icon" variant="ghost" disabled={disabled}>
					<Pencil2Icon className="text-orange-300" />
				</Button>
			}
			isDisabled={disabled}
		/>
	);
}

export function DeleteLectureModal({
	id,
	courseId,
}: {
	id: string;
	courseId: string;
}) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const deleteLectureMutation = useMutation({
		mutationFn: () => deleteLecture(id),
		onSuccess: () => {
			toast.success(t("lecture_deleted"));
			queryClient.invalidateQueries({
				queryKey: ["teacher-lectures"],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", courseId],
			});
			queryClient.invalidateQueries({
				queryKey: ["course-lectures", courseId],
			});
		},
		onError: () => {
			toast.error(t("delete_lecture_error"));
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<TrashIcon className="text-destructive" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("delete_lecture")}</DialogTitle>
					<DialogDescription>
						{t("delete_lecture_confirm")}
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end items-center gap-4">
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					<Button
						onClick={() => {
							deleteLectureMutation.mutateAsync();
						}}
						variant="destructive"
						disabled={deleteLectureMutation.isPending}
					>
						{t("delete_lecture")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

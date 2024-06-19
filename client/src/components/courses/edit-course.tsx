import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "~/contexts/translation";
import { updateCourse } from "~/services/courses";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Pencil2Icon, UpdateIcon } from "@radix-ui/react-icons";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { createCourseSchema } from "~/pages/courses/new";

import type { Course as TCourse } from "~/services/courses";
import type { CreateCourse } from "~/pages/courses/new";

export function EditCourse({ course }: { course: TCourse }) {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<Pencil2Icon className="size-5 me-2" />
					{t("edit_course")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("edit_course")}</DialogTitle>
				</DialogHeader>

				<EditForm course={course} close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function EditForm({ course, close }: { course: TCourse; close: () => void }) {
	const { t } = useTranslation();
	const form = useForm<CreateCourse>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: course,
	});

	const queryClient = useQueryClient();

	const editCourseMutation = useMutation({
		mutationFn: (values: CreateCourse) => updateCourse(course.id, values),
		onSuccess: () => {
			toast.success(t("update_course_success"));
			queryClient.invalidateQueries({
				queryKey: ["course", course.id],
			});
			close();
		},
		onError: (err: any) => {
			if ("messages" in err) {
				for (const { path, message } of err.messages) {
					form.setError(path, { message });
				}
			}
			if ("message" in err) {
				toast.error(err.message);
			}
		},
	});

	function handleSubmit(values: CreateCourse) {
		editCourseMutation.mutateAsync(values);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-2"
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("course_name")}</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={t("course_name_placeholder")}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="code"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("course_code")}</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={t("course_code_placeholder")}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="creditHours"
					render={({ field: { onChange, ...field } }) => (
						<FormItem>
							<FormLabel>{t("credit_hours")}</FormLabel>
							<FormControl>
								<Input
									{...field}
									onChange={(e) =>
										onChange(e.target.valueAsNumber)
									}
									type="number"
									placeholder={t(
										"course_credit_hours_placeholder"
									)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("course_content")}</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									placeholder={t(
										"course_content_placeholder"
									)}
									className="h-32"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="text-center pt-2">
					<Button
						type="submit"
						className="btn btn-primary"
						disabled={editCourseMutation.isPending}
					>
						{editCourseMutation.isPending ? (
							<UpdateIcon className="animate-spin" />
						) : (
							t("submit")
						)}
					</Button>
				</div>
			</form>
		</Form>
	);
}

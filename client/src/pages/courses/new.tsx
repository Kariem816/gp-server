import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTranslation } from "~/contexts/translation";
import { useSecurePage } from "~/hooks/use-secure-page";
import { createCourse } from "~/services/courses";

export const Route = createFileRoute("/courses/new")({
	component: CreateCoursePage,
});

const createCourseSchema = z.object({
	name: z.string().min(3).max(255),
	code: z.string().regex(/^[A-Z]{3}[0-9]{3}s?$/),
	creditHours: z.number().int().min(0).max(6),
	content: z.string().optional(),
});

type CreateCourse = z.infer<typeof createCourseSchema>;

function CreateCoursePage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t } = useTranslation();
	const form = useForm<CreateCourse>({
		resolver: zodResolver(createCourseSchema),
		defaultValues: {
			name: "",
			code: "",
			creditHours: 3,
			content: "",
		},
	});
	useSecurePage("/", "admin");
	const navigate = useNavigate();

	async function handleSubmit(values: CreateCourse) {
		setIsSubmitting(true);
		try {
			const { data: course } = await createCourse(values);
			toast.success(t("create_course_success"));
			navigate({
				to: "/courses/$id",
				params: { id: course.id },
			});
		} catch (err: any) {
			if ("messages" in err) {
				for (const message of err.messages) {
					form.setError(message.path, {
						type: "validate",
						message: message.message,
					});
				}
			}
			if ("message" in err) {
				toast.error(err.message);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="h-full grid place-items-center py-4 overflow-y-auto">
			<Card className="w-9/12 md:w-1/2 max-w-5xl mx-auto">
				<CardHeader>
					<CardTitle>
						<h1 className="my-0">{t("new_course")}</h1>
					</CardTitle>
					<p className="text-sm">{t("new_course_description")}</p>
				</CardHeader>
				<CardContent>
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
										<FormLabel>
											{t("course_name")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(
													"course_name_placeholder"
												)}
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
										<FormLabel>
											{t("course_code")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(
													"course_code_placeholder"
												)}
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
										<FormLabel>
											{t("credit_hours")}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												onChange={(e) =>
													onChange(
														e.target.valueAsNumber
													)
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
										<FormLabel>
											{t("course_content")}
										</FormLabel>
										<FormControl>
											<Textarea
												{...field}
												placeholder={t(
													"course_content_placeholder"
												)}
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
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<UpdateIcon className="animate-spin" />
									) : (
										t("submit")
									)}
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}

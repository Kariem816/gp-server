import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "~/contexts/translation";
import { deleteCourse } from "~/services/courses";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";

import type { Course as TCourse } from "~/services/courses";

export function DeleteCourse({ course }: { course: TCourse }) {
	const [open, setOpen] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { t } = useTranslation();
	const navigate = useNavigate();

	async function handleDelete() {
		setDeleting(true);
		try {
			await deleteCourse(course.id);
			setOpen(false);
			navigate({ to: "/courses" });
			toast.success(t("course_deleted"));
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setDeleting(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<TrashIcon className="size-6" /> {t("delete_course")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("delete_course")}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p>{t("delete_course_prompt")}</p>
					<div className="flex gap-2 justify-end">
						<Button
							onClick={() => setOpen(false)}
							variant="outline"
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleDelete}
							disabled={deleting}
							variant="destructive"
						>
							{deleting && (
								<UpdateIcon className="animate-spin me-2" />
							)}
							{t("delete")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

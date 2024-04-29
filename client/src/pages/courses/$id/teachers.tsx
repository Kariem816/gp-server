import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SignedInAs } from "~/components/auth";
import { Spinner } from "~/components/loaders";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/contexts/translation";
import useDebounce from "~/hooks/use-debounce";
import { useSecurePage } from "~/hooks/use-secure-page";
import {
	Teacher,
	addTeachersToCourse,
	getCourseTeachers,
	removeTeachersFromCourse,
} from "~/services/courses";
import { getTeachers } from "~/services/teachers";
import { cn } from "~/utils";

export const Route = createFileRoute("/courses/$id/teachers")({
	component: CourseTeachers,
});

function CourseTeachers() {
	const { id } = Route.useParams();
	const { t } = useTranslation();

	useSecurePage("/courses/" + id, "admin");

	const {
		data: teachers,
		isPending,
		isError,
		error,
		isRefetching,
		refetch,
	} = useQuery({
		queryKey: ["course-teachers", id],
		queryFn: () => getCourseTeachers(id),
		select: (data) => data.data,
	});

	const [removedTeachers, setRemovedTeachers] = useState<Teacher[]>([]);

	const queryClient = useQueryClient();

	const removeTeachersMutation = useMutation({
		mutationFn: () =>
			removeTeachersFromCourse(
				id,
				removedTeachers.map((t) => t.id)
			),
		onSuccess: async () => {
			toast.success(t("teachers_removed"));
			await queryClient.invalidateQueries({
				queryKey: ["course-teachers", id],
			});
			queryClient.invalidateQueries({
				queryKey: ["course", id],
			});
			setRemovedTeachers([]);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className="flex flex-col h-full">
			<div className="flex flex-col justify-center border-b-2 py-4 container">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<div className="flex gap-2 items-end">
						<h1 className="my-1">{t("teachers")}</h1>
						<Button
							variant="ghost"
							size="icon"
							onClick={() => refetch()}
						>
							<UpdateIcon
								className={cn(
									"text-primary",
									isRefetching && "animate-spin"
								)}
							/>
						</Button>
					</div>
					<SignedInAs role="admin">
						<AddTeacherDialog
							courseId={id}
							existingTeachers={teachers?.map((t) => t.id) ?? []}
						/>
					</SignedInAs>
				</div>
			</div>
			<div className="flex-grow overflow-auto p-2">
				{isError ? (
					<div className="text-destructive italic font-semibold h-full flex items-center justify-center">
						{error.message}
					</div>
				) : isPending ? (
					<div className="h-full flex justify-center items-center">
						<Spinner />
					</div>
				) : teachers.length === 0 ? (
					<div className="text-neutral-600 italic font-semibold h-full flex items-center justify-center">
						{t("no_teachers")}
					</div>
				) : (
					<div className="flex gap-4 flex-wrap">
						{teachers
							.filter(
								(t) =>
									!removedTeachers.some(
										(rt) => rt.id === t.id
									)
							)
							.map((teacher) => (
								<div
									key={teacher.id}
									className="p-2 flex justify-between items-center flex-grow bg-accent rounded-md gap-4"
								>
									<div className="flex gap-2 items-center">
										<Avatar>
											<AvatarImage
												src={teacher.user.img}
												alt={teacher.user.name}
											/>
											<AvatarFallback>
												{teacher.user.name[0]}
											</AvatarFallback>
										</Avatar>
										<span>{teacher.user.name}</span>
									</div>
									<Button
										variant="destructive"
										onClick={() =>
											setRemovedTeachers((prev) => [
												...prev,
												teacher,
											])
										}
									>
										{t("remove")}
									</Button>
								</div>
							))}
					</div>
				)}

				{removedTeachers.length > 0 && (
					<>
						<h2>{t("removed_teachers")}</h2>
						<div className="flex gap-4 flex-wrap pb-10">
							{removedTeachers.map((teacher) => (
								<div
									key={teacher.id}
									className="p-2 flex justify-between items-center flex-grow bg-accent rounded-md"
								>
									<div className="flex gap-2 items-center">
										<Avatar>
											<AvatarImage
												src={teacher.user.img}
												alt={teacher.user.name}
											/>
											<AvatarFallback>
												{teacher.user.name[0]}
											</AvatarFallback>
										</Avatar>
										<span>{teacher.user.name}</span>
									</div>
									<Button
										onClick={() =>
											setRemovedTeachers((prev) =>
												prev.filter(
													(t) => t.id !== teacher.id
												)
											)
										}
									>
										{t("undo")}
									</Button>
								</div>
							))}
						</div>
						<div className="flex p-2 rounded-md justify-end gap-2 absolute left-4 bottom-4 right-4 shadow-lg border">
							<Button
								variant="outline"
								onClick={() => setRemovedTeachers([])}
							>
								{t("cancel")}
							</Button>
							<Button
								disabled={
									removedTeachers.length === 0 ||
									removeTeachersMutation.isPending
								}
								onClick={() =>
									removeTeachersMutation.mutateAsync()
								}
							>
								{removeTeachersMutation.isPending && (
									<UpdateIcon className="animate-spin size-6 me-2" />
								)}
								{t("save")}
							</Button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}

function AddTeacherDialog({
	courseId,
	existingTeachers,
}: {
	courseId: string;
	existingTeachers: string[];
}) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="inline-flex gap-2">
					<PlusIcon />
					<span>{t("add")}</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("add_teachers")}</DialogTitle>
				</DialogHeader>
				<AddTeacherDialogContent
					courseId={courseId}
					existingTeachers={existingTeachers}
					close={() => setOpen(false)}
				/>
			</DialogContent>
		</Dialog>
	);
}

function AddTeacherDialogContent({
	courseId,
	existingTeachers,
	close,
}: {
	courseId: string;
	existingTeachers: string[];
	close: () => void;
}) {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");
	const [addedTeachers, setAddedTeachers] = useState<Teacher[]>([]);

	const debouncedSearch = useDebounce(search, 500);

	const { data: teachers, isPending } = useQuery({
		queryKey: ["teachers", debouncedSearch],
		queryFn: () => getTeachers({ search }),
		select: (data) => data.data,
	});
	const queryClient = useQueryClient();

	const addTeachersMutation = useMutation({
		mutationFn: () =>
			addTeachersToCourse(
				courseId,
				addedTeachers.map((t) => t.id)
			),
		onSuccess: async () => {
			toast.success(t("teachers_added"));
			await queryClient.invalidateQueries({
				queryKey: ["course-teachers", courseId],
			});
			await queryClient.invalidateQueries({
				queryKey: ["course", courseId],
			});
			close();
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<div className="space-y-4">
			<Input
				placeholder={t("search_name")}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<div className="flex gap-4 flex-wrap">
				{isPending || !teachers ? (
					<div className="flex-grow flex justify-center items-center">
						<Spinner />
					</div>
				) : teachers.filter(
						(t) =>
							!existingTeachers.includes(t.id) &&
							!addedTeachers.some((at) => at.id === t.id)
				  ).length === 0 ? (
					<p className="text-neutral-600 italic font-semibold flex-grow text-center">
						{t("no_teachers")}
					</p>
				) : (
					teachers
						.filter(
							(t) =>
								!existingTeachers.includes(t.id) &&
								!addedTeachers.some((at) => at.id === t.id)
						)
						.map((teacher) => (
							<div
								className="p-2 flex justify-between items-center flex-grow bg-accent rounded-md"
								key={teacher.id}
							>
								<div className=" flex gap-2 items-center">
									<Avatar>
										<AvatarImage
											src={teacher.user.img}
											alt={teacher.user.name}
										/>
										<AvatarFallback>
											{teacher.user.name[0]}
										</AvatarFallback>
									</Avatar>
									<span>{teacher.user.name}</span>
								</div>
								<Button
									className="bg-emerald-400 hover:bg-emerald-500"
									onClick={() =>
										setAddedTeachers((prev) => [
											...prev,
											teacher,
										])
									}
								>
									{t("add")}
								</Button>
							</div>
						))
				)}
			</div>

			{addedTeachers.length > 0 && (
				<>
					<h2>{t("added_teachers")}</h2>
					<div className="flex gap-4 flex-wrap">
						{addedTeachers.map((teacher) => (
							<div
								key={teacher.id}
								className="p-2 flex justify-between items-center flex-grow bg-accent rounded-md"
							>
								<div className="flex gap-2 items-center">
									<Avatar>
										<AvatarImage
											src={teacher.user.img}
											alt={teacher.user.name}
										/>
										<AvatarFallback>
											{teacher.user.name[0]}
										</AvatarFallback>
									</Avatar>
									<span>{teacher.user.name}</span>
								</div>
								<Button
									variant="destructive"
									onClick={() =>
										setAddedTeachers((prev) =>
											prev.filter(
												(t) => t.id !== teacher.id
											)
										)
									}
								>
									{t("remove")}
								</Button>
							</div>
						))}
					</div>
				</>
			)}

			<div className="flex justify-end gap-2">
				<DialogClose asChild>
					<Button variant="outline">{t("cancel")}</Button>
				</DialogClose>
				<Button
					disabled={
						addedTeachers.length === 0 ||
						addTeachersMutation.isPending
					}
					onClick={() => addTeachersMutation.mutateAsync()}
				>
					{addTeachersMutation.isPending && (
						<UpdateIcon className="animate-spin size-6 me-2" />
					)}
					{t("save")}
				</Button>
			</div>
		</div>
	);
}

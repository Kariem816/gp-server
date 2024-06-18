import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon, UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Spinner } from "~/components/loaders";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/contexts/translation";
import {
	controlElements,
	getControllerPermissions,
	updateController,
} from "~/services/controllers";

import type { LoggedUser } from "~/types/users";
import { ControllerControls } from "./new";

const UpdateControllerSchema = z.object({
	location: z.string().optional(),
	controls: z.array(z.enum(controlElements)),
});

type TUpdateControllerSchema = z.infer<typeof UpdateControllerSchema>;

export function EditController({ controller }: { controller: LoggedUser }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const form = useForm<TUpdateControllerSchema>({
		resolver: zodResolver(UpdateControllerSchema),
		defaultValues: {
			location: "",
			controls: [],
		},
	});

	const {
		data: permissions,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["controlling", controller.id],
		queryFn: () => getControllerPermissions(controller.id),
		select: (data) => data.data,
		enabled: open,
	});

	useEffect(() => {
		if (permissions) {
			form.setValue("controls", permissions);
		}
	}, [permissions, controller]);

	const queryClient = useQueryClient();

	const updateControllerMutation = useMutation({
		mutationFn: (data: TUpdateControllerSchema) =>
			updateController(controller.id, data),
		onSuccess: () => {
			toast.success(t("controller_updated"));
			queryClient.invalidateQueries({
				queryKey: ["controllers"],
			});
			queryClient.invalidateQueries({
				queryKey: ["controlling", controller.id],
			});
			setOpen(false);
		},
		onError: (error: any) => {
			if ("message" in error) {
				toast.error(error.message);
			} else if ("messages" in error) {
				for (const err of error.messages) {
					const { path, message } = err;
					form.setError(path, { message });
				}
			}
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="warning">
					<Pencil2Icon className="me-2" />
					{t("edit")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("edit_controller")}</DialogTitle>
				</DialogHeader>

				{isError ? (
					<div className="flex items-center justify-center h-64">
						<p className="text-destructive text-center italic">
							{error.message}
						</p>
					</div>
				) : isLoading || !permissions ? (
					<div className="flex items-center justify-center h-64">
						<Spinner />
					</div>
				) : (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((data) =>
								updateControllerMutation.mutateAsync(data)
							)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="location"
								render={({ field: { value, ...field } }) => (
									<FormItem>
										<FormLabel>
											{t("location")} ({t("optional")})
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={value ?? ""}
												placeholder={"Garden"}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="controls"
								render={() => (
									<FormItem>
										<FormLabel>
											{t("permissions")}
										</FormLabel>
										<FormControl>
											<ControllerControls name="controls" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex justify-end gap-4">
								<DialogClose asChild>
									<Button
										variant="outline"
										type="button"
										disabled={
											updateControllerMutation.isPending
										}
									>
										{t("cancel")}
									</Button>
								</DialogClose>
								<Button
									disabled={
										updateControllerMutation.isPending
									}
								>
									{updateControllerMutation.isPending && (
										<UpdateIcon className="me-2 animate-spin" />
									)}
									{t("submit")}
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
}

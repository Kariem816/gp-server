import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
	UseFormReturn,
	useFieldArray,
	useForm,
	useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
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
import { controlElements, registerController } from "~/services/controllers";

const NewControllerSchema = z.object({
	user: z.object({
		name: z.string().min(1),
		username: z.string().min(1),
		password: z.string().min(1),
	}),
	controller: z.object({
		location: z.string().optional(),
		controls: z.array(z.enum(controlElements)),
	}),
});

type TNewControllerSchema = z.infer<typeof NewControllerSchema>;

export function NewController() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const form = useForm<TNewControllerSchema>({
		resolver: zodResolver(NewControllerSchema),
		defaultValues: {
			user: {
				name: "",
				username: "",
				password: "",
			},
			controller: {
				location: "",
				controls: [],
			},
		},
	});

	const queryClient = useQueryClient();

	const newControllerMutation = useMutation({
		mutationFn: registerController,
		onSuccess: () => {
			toast.success(t("controller_created"));
			queryClient.invalidateQueries({
				queryKey: ["controllers"],
			});
			setOpen(false);
			form.reset();
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
				<Button>
					<PlusIcon className="me-2" />
					{t("new")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("new_controller")}</DialogTitle>
					<DialogDescription>
						{t("new_controller_desc")}
					</DialogDescription>
				</DialogHeader>

				<NewControllerForm
					form={form}
					loading={newControllerMutation.isPending}
					onSubmit={newControllerMutation.mutateAsync}
				/>
			</DialogContent>
		</Dialog>
	);
}

function NewControllerForm({
	form,
	onSubmit,
	loading = false,
}: {
	form: UseFormReturn<TNewControllerSchema>;
	onSubmit: (values: TNewControllerSchema) => void;
	loading?: boolean;
}) {
	const { t } = useTranslation();

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				<FormField
					control={form.control}
					name="user.name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("name")}</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={"Sayed Controlla"}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="user.username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("username")}</FormLabel>
							<FormControl>
								<Input {...field} placeholder={"scont"} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="user.password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("password")}</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="password"
									placeholder={"********"}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="controller.location"
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
					name="controller.controls"
					render={() => (
						<FormItem>
							<FormLabel>{t("permissions")}</FormLabel>
							<FormControl>
								<ControllerControls name="controller.controls" />
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
							disabled={loading}
						>
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button disabled={loading}>
						{loading && (
							<UpdateIcon className="me-2 animate-spin" />
						)}
						{t("submit")}
					</Button>
				</div>
			</form>
		</Form>
	);
}

export function ControllerControls({ name }: { name: string }) {
	const { control } = useFormContext();
	const { t } = useTranslation();
	const { fields, append, remove } = useFieldArray({
		control,
		name,
	});
	const controls = (() => {
		const existing = fields.map(({ id, ...el }, idx) => ({
			id,
			value: Object.values(el).join(""),
			idx,
		}));
		return controlElements.map((el) => {
			const value = existing.find(({ value }) => value === el);
			return value ? value : { value: el, id: el, idx: -1 };
		});
	})();

	return (
		<div className="flex flex-wrap gap-2">
			{controls.map(({ id, value, idx }) => (
				<Button
					key={id}
					variant={idx === -1 ? "outline" : "default"}
					size="sm"
					className="border"
					onClick={
						idx === -1 ? () => append(value) : () => remove(idx)
					}
					type="button"
				>
					{t(value)}
				</Button>
			))}
		</div>
	);
}

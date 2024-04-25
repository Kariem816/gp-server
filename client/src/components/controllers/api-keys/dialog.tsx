import { PlusIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/contexts/translation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { createApiKey } from "~/services/controllers";
import { useQueryClient } from "@tanstack/react-query";

const newApiKeySchema = z.object({
	name: z.string(),
	expiresAt: z.date().min(new Date(), "must_be_future").optional(),
});

export function CreateApiKeyDialog() {
	const [open, setOpen] = useState(false);
	const { t } = useTranslation();
	const form = useForm<z.infer<typeof newApiKeySchema>>({
		resolver: zodResolver(newApiKeySchema),
		defaultValues: {
			name: "",
			expiresAt: undefined,
		},
	});
	const queryClient = useQueryClient();

	// eslint-disable-next-line
	function handleDateChange(onChange: any) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const date = new Date(value);
			const oldDate = form.getValues("expiresAt") || new Date();
			oldDate.setFullYear(
				date.getFullYear(),
				date.getMonth(),
				date.getDate()
			);
			onChange(oldDate);
		};
	}

	// eslint-disable-next-line
	function handleTimeChange(onChange: any) {
		return (e: ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			const [hours, minutes] = value.split(":");
			const oldDate = form.getValues("expiresAt") || new Date();
			oldDate.setHours(Number(hours), Number(minutes));
			onChange(oldDate);
		};
	}

	function dateValue(date: Date | undefined | null) {
		if (!date) return "";
		return date.toISOString().split("T")[0];
	}

	function timeValue(date: Date | undefined | null) {
		if (!date) return "";
		const [hours, minutes] = date.toISOString().split("T")[1].split(":");
		const timezone = new Date().getTimezoneOffset() / 60;

		const hourz = parseInt(hours) - timezone;

		return `${hourz.toString().padStart(2, "0")}:${minutes}`;
	}

	async function handleSubmit(values: z.infer<typeof newApiKeySchema>) {
		try {
			await createApiKey(values);
			toast.success(t("key_created"));
			form.reset();
			await queryClient.invalidateQueries({ queryKey: ["my-api-keys"] });
			setOpen(false);
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
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon">
					<PlusIcon className="text-primary size-6" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("create_key")}</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("api_key_name")}</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="testing"
											autoFocus
										/>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="expiresAt"
							render={({
								field: { value, onChange, ...field },
							}) => (
								<FormItem>
									<FormLabel>
										{t("expires_at")} ({t("optional")})
									</FormLabel>
									<FormControl>
										<div className="flex gap-4">
											<Input
												value={dateValue(value)}
												onChange={handleDateChange(
													onChange
												)}
												{...field}
												placeholder="2024-12-31"
												type="date"
											/>
											<Input
												value={timeValue(value)}
												onChange={handleTimeChange(
													onChange
												)}
												{...field}
												placeholder="12:00"
												type="time"
											/>
										</div>
									</FormControl>
									<FormDescription />
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-4 mt-4">
							<DialogClose asChild>
								<Button
									type="button"
									variant="outline"
									disabled={form.formState.disabled}
								>
									{t("cancel")}
								</Button>
							</DialogClose>
							<Button
								type="submit"
								disabled={form.formState.disabled}
							>
								{t("create")}
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

import { useTranslation } from "~/contexts/translation";
import { useState } from "react";
import { changePassword } from "~/services/auth";
import { useAuth } from "~/contexts/auth";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const changePasswordSchema = z
	.object({
		oldPassword: z.string().min(1),
		newPassword: z.string().min(6),
		confirmNewPassword: z.string().min(6),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "passwords_dont_match",
		path: ["confirmNewPassword"],
	});

export default function ChangePassword() {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="flex">
				<DialogTrigger asChild>
					<Button variant="link" className="text-foreground p-0">
						{t("change_password")}
					</Button>
				</DialogTrigger>
			</div>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("change_password")}</DialogTitle>
					<DialogDescription>
						{t("change_password_desc")}
					</DialogDescription>
				</DialogHeader>

				<Content close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function Content({ close }: { close: () => void }) {
	const { t } = useTranslation();
	const { logout } = useAuth();
	const [error, setError] = useState("");

	const form = useForm<z.infer<typeof changePasswordSchema>>({
		resolver: zodResolver(changePasswordSchema),
		defaultValues: {
			oldPassword: "",
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	async function handleSubmit(values: z.infer<typeof changePasswordSchema>) {
		try {
			await changePassword(values.oldPassword, values.newPassword);

			close();
			toast.success(t("change_password_success"), {
				// TODO: check if both do the same thing
				onDismiss: () => {
					logout();
				},
				onAutoClose: () => {
					logout();
				},
				closeButton: true,
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
				setError(err.message);
			}
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4"
			>
				<FormField
					name="oldPassword"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("current_password")}</FormLabel>
							<FormControl>
								<Input {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="newPassword"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("new_password")}</FormLabel>
							<FormControl>
								<Input {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					name="confirmNewPassword"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("new_password_confirm")}</FormLabel>
							<FormControl>
								<Input {...field} type="password" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{error && (
					<div className="h-full grid place-items-center">
						<p className="text-destructive italic">{error}</p>
					</div>
				)}

				<DialogFooter>
					<div className="flex justify-end items-center gap-2">
						<Button
							onClick={close}
							variant="outline"
							type="button"
							disabled={form.formState.isLoading}
						>
							{t("cancel")}
						</Button>
						<Button disabled={form.formState.isLoading}>
							{form.formState.isLoading && (
								<UpdateIcon className="animate-spin me-2" />
							)}
							{t("change_password")}
						</Button>
					</div>
				</DialogFooter>
			</form>
		</Form>
	);
}

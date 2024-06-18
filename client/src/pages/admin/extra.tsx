import { zodResolver } from "@hookform/resolvers/zod";
import { BellIcon, UpdateIcon } from "@radix-ui/react-icons";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
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
import { notifyAllUsers } from "~/services/users";

export const Route = createFileRoute("/admin/extra")({
	component: ExtraPage,
});

function ExtraPage() {
	return (
		<div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<NotifyAll />
		</div>
	);
}

function NotifyAll() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<div className="p-4 rounded-lg shadow-md space-y-4 flex flex-col">
			<h2 className="text-xl font-semibold m-0">{t("notify_all")}</h2>
			<p className="text-gray-500">{t("notify_all_desc")}</p>
			<div className="flex justify-end self-end">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button size="icon" variant="ghost">
							<BellIcon />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("send_notif")}</DialogTitle>
						</DialogHeader>

						<NotificationForm close={() => setOpen(false)} />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}

const notificationSchema = z.object({
	title: z.string().min(1),
	body: z.string().min(1),
});

function NotificationForm({ close }: { close: () => void }) {
	const { t } = useTranslation();
	const form = useForm<z.infer<typeof notificationSchema>>({
		resolver: zodResolver(notificationSchema),
		defaultValues: {
			title: "",
			body: "",
		},
	});

	async function sendNotification(
		values: z.infer<typeof notificationSchema>
	) {
		try {
			const res = await notifyAllUsers(values);
			close();
			toast.success(res.data.message);
		} catch (err) {
			console.error(err);
			toast.error(t("notif_error"));
		}
	}

	return (
		<Form {...form}>
			<form
				className="space-y-4"
				onSubmit={form.handleSubmit(sendNotification)}
			>
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("title")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t("notif_title")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="body"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("body")}</FormLabel>
							<FormControl>
								<Input
									placeholder={t("notif_body")}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DialogFooter>
					<div className="flex justify-end items-center gap-2">
						<Button onClick={close} variant="outline" type="button">
							{t("cancel")}
						</Button>
						<Button disabled={form.formState.isLoading}>
							{form.formState.isLoading && (
								<UpdateIcon className="animate-spin me-2" />
							)}
							{t("send")}
						</Button>
					</div>
				</DialogFooter>
			</form>
		</Form>
	);
}

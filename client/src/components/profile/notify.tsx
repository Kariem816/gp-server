import { useState } from "react";
import { useTranslation } from "~/contexts/translation";
import { notifyUser } from "~/services/users";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";

import type { LoggedUser } from "~/types/users";
import { Button } from "../ui/button";
import { UpdateIcon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

const notificationSchema = z.object({
	title: z.string().min(1),
	body: z.string().min(1),
});

export default function Notify({ user }: { user: LoggedUser }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="link" className="text-foreground p-0">
					{t("send_notif")}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("send_notif")}</DialogTitle>
				</DialogHeader>

				<Content userId={user.id} close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function Content({ userId, close }: { userId: string; close: () => void }) {
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
			const res = await notifyUser(userId, values);
			close();
			toast.success(res.message);
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

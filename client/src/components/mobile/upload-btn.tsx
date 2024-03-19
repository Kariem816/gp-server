import { useState } from "react";
import { uploadMobileApp } from "~/services/mobile";
import {
	Dialog,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
	DialogContent,
	DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const uploadSchema = z.object({
	url: z.string().url(),
	version: z.string().min(1),
});

export function UploadBtn() {
	const [isLoading, setIsLoading] = useState(false);
	const form = useForm<z.infer<typeof uploadSchema>>({
		resolver: zodResolver(uploadSchema),
		defaultValues: {
			url: "",
			version: "",
		},
	});
	const [formError, setFormError] = useState("");

	async function handleUpload(values: z.infer<typeof uploadSchema>) {
		setIsLoading(true);
		try {
			await uploadMobileApp(values.url, values.version);
			close();
		} catch (err: any) {
			if ("message" in err) setFormError(err.message);
			else if ("messages" in err)
				for (const message of err.messages) {
					form.setError(message.path, message.message);
				}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button>Upload new version</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Upload new version</DialogTitle>
					</DialogHeader>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleUpload)}>
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>File URL</FormLabel>
										<FormControl>
											<Input
												placeholder="File URL"
												required
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="version"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Version</FormLabel>
										<FormControl>
											<Input
												placeholder="1.2.3"
												required
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{formError && (
								<p className="text-danger mt-2">{formError}</p>
							)}

							<div className="flex justify-end gap-2 mt-2">
								<DialogClose asChild>
									<Button variant="outline">Cancel</Button>
								</DialogClose>
								<Button type="submit" disabled={isLoading}>
									Upload
								</Button>
							</div>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</>
	);
}

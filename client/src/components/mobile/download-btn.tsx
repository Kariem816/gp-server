import { useState } from "react";
import { getVersionUrl } from "~/services/mobile";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

type DownloadBtnProps = {
	os?: "android" | "ios";
	disabled?: boolean;
};

export function DownloadBtn({ disabled }: DownloadBtnProps) {
	const [isLoading, setIsLoading] = useState(false);

	async function handleDownload() {
		setIsLoading(true);
		try {
			await getVersionUrl().then(({ data: { url } }) => {
				const link = document.createElement("a");
				link.href = url;
				document.body.appendChild(link);
				link.click();
				link.remove();
			});
		} catch (err) {
			console.error(err);
		} finally {
			close();
			setIsLoading(false);
		}
	}

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button disabled={disabled}>Download for Android</Button>
				</DialogTrigger>
				<DialogContent>
					<h4>Smart Campus App</h4>
					<p className="mb-2">You are about to download our app</p>

					<div className="flex justify-end gap-2">
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button onClick={handleDownload} disabled={isLoading}>
							Download
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}

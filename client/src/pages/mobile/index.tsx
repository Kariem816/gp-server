import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import { SignedInAs } from "~/components/auth";
import { getLatestVersion } from "~/services/mobile";
import { DownloadBtn } from "~/components/mobile/download-btn";
import { UploadBtn } from "~/components/mobile/upload-btn";
import { Button } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

export const Route = createFileRoute("/mobile/")({
	component: AppPage,
});

function AppPage() {
	const [latest, setLatest] = useState<string>();
	const [canDownload, setCanDownload] = useState(false);
	const [isLatestLoading, startLoadingLatest] = useTransition();

	useEffect(() => {
		startLoadingLatest(() => {
			getLatestVersion()
				.then((res) => {
					setLatest(`Latest Version: v${res.data.version}`);
					setCanDownload(true);
				})
				.catch((err: any) => {
					setLatest(err.message);
				});
		});
	}, []);

	return (
		<div className="flex flex-col items-center text-center">
			<h1>Smart Campus App</h1>
			<p>
				Download the Smart Campus App to get access to all the features!
			</p>
			<p className="my-2">
				{isLatestLoading ? "Loading latest version..." : latest}
			</p>
			<div className="flex justify-center gap-2">
				<DownloadBtn disabled={!canDownload} />
				<TooltipProvider>
					<Tooltip disableHoverableContent>
						<TooltipTrigger>
							<Button disabled>Download for iOS</Button>
						</TooltipTrigger>
						<TooltipContent className="bg-muted text-foreground">
							Not available at the moment
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<SignedInAs role="admin">
				<div className="my-4">
					<UploadBtn />
				</div>
			</SignedInAs>
		</div>
	);
}

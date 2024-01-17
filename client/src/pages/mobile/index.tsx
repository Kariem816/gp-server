import { Button, Group, Stack, Text, Title, Tooltip } from "@mantine/core";
import { FileRoute } from "@tanstack/react-router";
import { useEffect, useState, useTransition } from "react";
import { SignedInAs } from "~/components/auth";
import { getLatestVersion } from "~/services/mobile";
import { DownloadBtn } from "~/components/mobile/download-btn";
import { UploadBtn } from "~/components/mobile/upload-btn";

export const Route = new FileRoute("/mobile/").createRoute({
	component: appPage,
});

function appPage() {
	const [latest, setLatest] = useState<string>();
	const [canDownload, setCanDownload] = useState(false);
	const [isLatestLoading, startLoadingLatest] = useTransition();

	useEffect(() => {
		startLoadingLatest(() => {
			getLatestVersion()
				.then((res) => {
					setLatest(`Latest Version: v${res.version}`);
					setCanDownload(true);
				})
				.catch((err: any) => {
					setLatest(err.message);
				});
		});
	}, []);

	return (
		<Stack align="center">
			<Title order={1} ta="center">
				Smart Campus App
			</Title>
			<Text ta="center">
				Download the Smart Campus App to get access to all the features!
			</Text>
			<Text ta="center">
				{isLatestLoading ? "Loading latest version..." : latest}
			</Text>
			<Group justify="center">
				<DownloadBtn disabled={!canDownload} />
				<Tooltip label="Not available at the moment">
					<Button variant="gradient" disabled>
						Download for iOS
					</Button>
				</Tooltip>
			</Group>
			<SignedInAs role="admin">
				<UploadBtn />
			</SignedInAs>
		</Stack>
	);
}

import { Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { getVersionUrl } from "~/services/mobile";

type DownloadBtnProps = {
	os?: "android" | "ios";
	disabled?: boolean;
};

export function DownloadBtn({ disabled }: DownloadBtnProps) {
	const [opened, { open, close }] = useDisclosure(false);
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
			console.log(err);
		} finally {
			close();
			setIsLoading(false);
		}
	}

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title="Smart Campus App"
				centered
			>
				<Text mb="md">You are about to download our app</Text>

				<Group justify="flex-end">
					<Button onClick={close} variant="outline">
						Cancel
					</Button>
					<Button onClick={handleDownload} loading={isLoading}>
						Download
					</Button>
				</Group>
			</Modal>

			<Button variant="gradient" onClick={open} disabled={disabled}>
				Download for Android
			</Button>
		</>
	);
}

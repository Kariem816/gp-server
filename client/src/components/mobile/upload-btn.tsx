import { Button, Group, Modal, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { uploadMobileApp } from "~/services/mobile";

type UploadBtnProps = {};

export function UploadBtn({}: UploadBtnProps) {
	const [opened, { open, close }] = useDisclosure(false);
	const [isLoading, setIsLoading] = useState(false);
	const uploadForm = useForm({
		initialValues: {
			url: "",
			version: "",
		},
	});
	const [formError, setFormError] = useState<string>("");

	async function handleUpload(values: typeof uploadForm.values) {
		setIsLoading(true);
		try {
			await uploadMobileApp(values.url, values.version);
			close();
		} catch (err: any) {
			if ("message" in err) setFormError(err.message);
			else if ("messages" in err)
				for (const message of err.messages) {
					uploadForm.setFieldError(message.path, message.message);
				}
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<Modal
				opened={opened}
				onClose={close}
				title="Upload new version"
				centered
			>
				<form onSubmit={uploadForm.onSubmit(handleUpload)}>
					<TextInput
						label="File URL"
						required
						placeholder="File URL"
						{...uploadForm.getInputProps("url")}
					/>
					<TextInput
						mt="md"
						label="Version"
						required
						placeholder="1.2.3"
						{...uploadForm.getInputProps("version")}
					/>

					{formError && (
						<Text c="red" mt="md">
							{formError}
						</Text>
					)}

					<Group justify="flex-end" mt="md">
						<Button onClick={close} variant="outline">
							Cancel
						</Button>
						<Button type="submit" loading={isLoading}>
							Upload
						</Button>
					</Group>
				</form>
			</Modal>

			<Button onClick={open}>Upload new version</Button>
		</>
	);
}

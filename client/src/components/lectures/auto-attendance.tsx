import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "~/contexts/translation";
import { useUploadThing } from "~/hooks/use-uploadthing";
import { Input } from "~/components/ui/input";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export function AutoAttendance({
	lectureId,
	disabled = false,
	close,
}: {
	lectureId: string;
	disabled?: boolean;
	close: () => void;
}) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const [file, setFile] = useState<File>();

	const { isUploading, /* permittedFileInfo, */ startUpload } =
		useUploadThing("attendance", {
			onUploadBegin: () => {
				toast.info(t("attendance_upload"), {
					description: t("attendance_upload_desc"),
				});
				close();
			},
			onClientUploadComplete: (res) => {
				const count = res[0]!.serverData.attendance;
				toast.success(t("attendance_uploaded"), {
					description: t("attendance_uploaded_desc", count),
				});

				// Invalidate queries
				queryClient.invalidateQueries({
					queryKey: ["lecture", lectureId],
				});
				queryClient.invalidateQueries({
					queryKey: ["lecture-attendance", lectureId],
				});
				queryClient.invalidateQueries({
					queryKey: ["lecture-absents", lectureId],
				});
				queryClient.invalidateQueries({
					queryKey: ["lecture-imgs", lectureId],
				});
			},
			onUploadError: (err) => {
				// @ts-expect-error we cannot do proper types on ut because of reasons
				toast.error(err.cause?.message);
			},
		});

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;

		setFile(files[0]);
	}

	function start() {
		if (!file) return;

		startUpload([file], { lectureId });
	}

	return (
		<>
			<Input type="file" accept="image/*" onChange={handleFileChange} />

			{file && (
				<img
					src={URL.createObjectURL(file)}
					className="w-full"
					alt=""
				/>
			)}

			<Button onClick={start} disabled={isUploading || !file || disabled}>
				{t("upload")}
			</Button>
		</>
	);
}

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { useUploadThing } from "~/hooks/use-uploadthing";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import { Cropper } from "../cropper";
import { crop } from "~/utils/images";

import type { CropData } from "~/utils/images";

export default function ProfilePic({
	img,
	name,
	isCurrentUser,
}: {
	img: string;
	name: string;
	isCurrentUser: boolean;
}) {
	return (
		<div className="relative">
			<Avatar className="size-36">
				<AvatarImage src={img} alt={name} />
				<AvatarFallback>{name[0]}</AvatarFallback>
			</Avatar>
			{isCurrentUser && <ChangePic />}
		</div>
	);
}

function ChangePic() {
	const { refreshUser } = useAuth();
	const { t } = useTranslation();
	const [progress, setProgress] = useState(0);
	const [open, setOpen] = useState(false);
	const [cropping, setCropping] = useState(false);

	const [cropData, setCropData] = useState<CropData>();
	const [file, setFile] = useState<string>();

	const { isUploading, routeConfig, startUpload } = useUploadThing(
		"profilePics",
		{
			onClientUploadComplete: () => {
				toast.success(t("change_img_success"));
				refreshUser();
				setOpen(false);
				setProgress(0);
				setFile(undefined);
				document
					.querySelector("input[type=file]")!
					.setAttribute("value", "");
			},
			onUploadError: (err) => {
				// @ts-expect-error we cannot do proper types on ut because of reasons
				toast.error(err.cause?.message);
			},
			onUploadProgress: setProgress,
		}
	);

	function handleOpenChange(newOpen: boolean) {
		if (isUploading) return;

		if (!newOpen) {
			setFile(undefined);
			document
				.querySelector("input[type=file]")!
				.setAttribute("value", "");
		}
		setOpen(newOpen);
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;

		const file = files[0];
		const fileUrl = URL.createObjectURL(file);
		setFile(fileUrl);
	}

	function start() {
		if (!file || !cropData) return;

		setCropping(true);
		const dims = { w: 1600, h: 900 };
		(async () => {
			try {
				const cropped = await crop(file, dims, cropData);
				const res = await fetch(cropped);
				const blob = await res.blob();
				setFile(cropped);
				setCropping(false);
				startUpload([new File([blob], "profilePic.png")]);
			} catch (err: any) {
				toast.error(err.message);
			}
		})();
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					size="icon"
					className="absolute bottom-0 end-0 bg-primary size-8 rounded-full"
				>
					<Pencil1Icon />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("change_img")}</DialogTitle>
					<DialogDescription>
						{t("change_img_info")}
					</DialogDescription>
				</DialogHeader>

				<Input
					type="file"
					accept={accept(routeConfig)}
					onChange={handleFileChange}
				/>

				{file &&
					(isUploading ? (
						<img src={file} alt="cropped" />
					) : (
						<Cropper
							img={file}
							// aspectRatio={1}
							disabled={isUploading}
							onChange={setCropData}
						/>
					))}

				{isUploading && (
					<div className="flex items-center gap-2">
						{/* TODO: add nicer progress bar */}
						<progress
							value={progress}
							max="100"
							className="flex-grow"
						/>
						<span>{progress}%</span>
					</div>
				)}

				<Button
					onClick={start}
					disabled={isUploading || cropping || !file}
				>
					{t("upload")}
				</Button>
			</DialogContent>
		</Dialog>
	);
}

function accept(
	permittedFileInfo: ReturnType<typeof useUploadThing>["routeConfig"]
) {
	if (!permittedFileInfo) return "";

	return Object.keys(permittedFileInfo)
		.map((key) => {
			if (key.includes("/")) return key;
			return key + "/*";
		})
		.join(",");
}

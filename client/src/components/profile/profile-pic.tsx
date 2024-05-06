import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { useUploadThing } from "~/hooks/use-uploadthing";
import { toast } from "sonner";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";

export default function ProfilePic({
	img,
	name,
	isCurrentUser,
}: {
	img: string;
	name: string;
	isCurrentUser: boolean;
}) {
	const [viewImg, setViewImg] = useState(img);

	return (
		<div className="relative">
			<Avatar className="size-36">
				<AvatarImage src={viewImg} alt={name} />
				<AvatarFallback>{name[0]}</AvatarFallback>
			</Avatar>
			{isCurrentUser && (
				<ChangePic
					update={(img) => setViewImg(img)}
					reset={() => setViewImg(img)}
				/>
			)}
		</div>
	);
}

function ChangePic({
	update,
	reset,
}: {
	update: (img: string) => void;
	reset: () => void;
}) {
	const { refreshUser } = useAuth();
	const { t } = useTranslation();
	const [progress, setProgress] = useState(0);
	const [open, setOpen] = useState(false);

	const [file, setFile] = useState<File>();

	const { isUploading, permittedFileInfo, startUpload } = useUploadThing(
		"profilePics",
		{
			onClientUploadComplete: () => {
				toast.success(t("change_img_success"));
				refreshUser();
				setOpen(false);
				reset();
			},
			onUploadError: (err) => {
				reset();
				if (err.message.includes("UploadThing")) {
					toast.error(t("generic_error"));
				} else {
					toast.error(err.message);
				}
			},
			onUploadProgress: setProgress,
		}
	);

	function start() {
		if (!file) return;

		update(URL.createObjectURL(file));
		startUpload([file]);
	}

	function handleOpenChange(newOpen: boolean) {
		if (isUploading) return;

		if (!newOpen) {
			reset();
		}
		setOpen(newOpen);
	}

	function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files;
		if (!files?.length) return;

		// TODO: add image cropping
		setFile(files[0]);
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
					accept={accept(permittedFileInfo)}
					onChange={handleFileChange}
				/>

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

				<DialogFooter>
					<div className="flex justify-end items-center gap-2">
						<DialogClose asChild>
							<Button
								variant="outline"
								onClick={reset}
								disabled={isUploading}
							>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button onClick={start} disabled={isUploading}>
							{t("upload")}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// TODO: calculate all input attributes
function accept(
	permittedFileInfo: ReturnType<typeof useUploadThing>["permittedFileInfo"]
) {
	if (!permittedFileInfo) return "";

	return Object.keys(permittedFileInfo.config)
		.map((key) => {
			if (key.includes("/")) return key;
			return key + "/*";
		})
		.join(",");
}

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

type UploadData =
	| {
			populated: false;
	  }
	| {
			populated: true;
			file: File;
			fileUrl: string;
			fileDims: { w: number; h: number };
			cropped?: File;
	  };

async function getImageDims(src: string) {
	return new Promise<{ w: number; h: number }>((resolve, reject) => {
		const img = new Image();
		img.src = src;
		img.onload = () => {
			resolve({ w: img.naturalWidth, h: img.naturalHeight });
		};
		img.onerror = reject;
	});
}

function ChangePic() {
	const { refreshUser } = useAuth();
	const { t } = useTranslation();
	const [progress, setProgress] = useState(0);
	const [open, setOpen] = useState(false);

	const [uploadData, setUploadData] = useState<UploadData>({
		populated: false,
	});

	const { isUploading, permittedFileInfo, startUpload } = useUploadThing(
		"profilePics",
		{
			onClientUploadComplete: () => {
				toast.success(t("change_img_success"));
				refreshUser();
				setOpen(false);
				setProgress(0);
				setUploadData({ populated: false });
				document
					.querySelector("input[type=file]")!
					.setAttribute("value", "");
			},
			onUploadError: (err) => {
				if (err.message.includes("UploadThing")) {
					toast.error(t("generic_error"));
				} else {
					toast.error(err.message);
				}
			},
			onUploadProgress: setProgress,
		}
	);

	function handleOpenChange(newOpen: boolean) {
		if (isUploading) return;

		if (!newOpen) {
			setUploadData({ populated: false });
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

		const img = new Image();
		img.src = fileUrl;

		getImageDims(fileUrl)
			.then((dims) => {
				setUploadData({
					populated: true,
					file,
					fileUrl,
					fileDims: dims,
				});
			})
			.catch(() => {
				document
					.querySelector("input[type=file]")!
					.setAttribute("value", "");
			});
	}

	function start() {
		if (!uploadData.populated) return;

		const { cropped, file, fileDims } = uploadData;

		if (!cropped && fileDims.w !== fileDims.h) {
			toast.error(t("change_img_square"));
			return;
		}

		startUpload([cropped ?? file]);
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

				{uploadData.populated && (
					<Cropper
						img={uploadData.fileUrl}
						// aspectRatio={1}
						disabled={isUploading}
						onCrop={(blob) => {
							setUploadData({
								...uploadData,
								cropped: new File([blob], uploadData.file.name),
							});
						}}
					/>
				)}

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
					disabled={
						!uploadData.populated ||
						(!uploadData.cropped &&
							uploadData.fileDims.h !== uploadData.fileDims.w)
					}
				>
					{t("upload")}
				</Button>
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

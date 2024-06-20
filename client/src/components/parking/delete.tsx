import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog"
import { useTranslation } from "~/contexts/translation";
import { Button } from "~/components/ui/button";
import {
	CopyIcon,
	InfoCircledIcon,
	TrashIcon,
	UpdateIcon,
} from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { deleteParkingSpot,ParkingSpot } from "~/services/parking";
import { toast } from "sonner";

export function ParkingSpo({ parking }: { parking: ParkingSpot }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	function handleCopy() {
		navigator.clipboard
			.writeText(parking.id)
			.then(() => {
				toast.success(t("id_copied"));
			})
			.catch();
	}

	return (
		<div className="rounded-lg bg-accent p-4 space-y-4  relative ">
			<div className="absolute -top-6 -end-3">
				<Dialog open={open} onOpenChange={setOpen}>
					<DialogTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="size-6 rounded-full"
						>
							<InfoCircledIcon />
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("parking_info")}</DialogTitle>
						</DialogHeader>

						<div className="space-y-4">
							<div className="flex justify-between items-center gap-4 flex-wrap">
								<h4 className="text-lg text-primary font-semibold">
									{t("id")}
								</h4>
								<Button onClick={handleCopy}>
									<CopyIcon className="me-2" />
									{t("copy_id")}
								</Button>
							</div>
							<div className="flex justify-between items-center gap-4">
								<h4 className="text-lg text-destructive font-semibold">
									{t("danger_zone")}
								</h4>

								<DeleteParkingSpo
									parking={parking}
									close={() => setOpen(false)}
								/>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
function DeleteParkingSpo({ parking, close }: { parking: ParkingSpot; close: () => void }) {
	const { t } = useTranslation();
	const [isDeleting, setIsDeleting] = useState(false);

	const queryClient = useQueryClient();

	async function handleDelete() {
		setIsDeleting(true);

		try {
			await deleteParkingSpot(parking.id);
			close();
			toast.success(t("parkSpot_deleted"));
			queryClient.invalidateQueries({
				queryKey: ["parking"],
			});
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="destructive">
					<TrashIcon className="me-2" />
					{t("delete")}
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{<p>Warning </p>}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p>{t("delete_parkSpot_warning")}</p>
					<div className="flex justify-end gap-4">
						<DialogClose asChild>
							<Button variant="outline" disabled={isDeleting}>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button
							variant="destructive"
							onClick={handleDelete}
							disabled={isDeleting}
						>
							{isDeleting && (
								<UpdateIcon className="animate-spin me-2" />
							)}
							{t("delete")}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
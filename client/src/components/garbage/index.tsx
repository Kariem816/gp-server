import { useTranslation } from "~/contexts/translation";
import { updateCan, deleteCan } from "~/services/garbage";
import LoadingBar from "~/components/loading-bar/loading-bar";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import {
	CheckIcon,
	
	CopyIcon,
	InfoCircledIcon,
	Pencil2Icon,
	TrashIcon,
	UpdateIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { dateTime, time } from "~/utils/formatters/time";

import type { TrashCan } from "~/services/garbage";

export function GarbageCan({ can }: { can: TrashCan }) {
	const { t, language } = useTranslation();
	const [open, setOpen] = useState(false);

	function handleCopy() {
		navigator.clipboard
			.writeText(can.id)
			.then(() => {
				toast.success(t("id_copied"));
			})
			.catch();
	}

	return (
		<div className="rounded-lg bg-accent p-4 space-y-4 shadow-lg relative">
			<div className="flex justify-between items-end gap-4 flex-wrap">
				<p className="text-center font-semibold">{can.location}</p>
				<p className="text-center text-sm">
					{time(can.lastEmptied, language)}
				</p>
			</div>
			<LoadingBar value={can.level} />

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
							<DialogTitle>{t("can_info")}</DialogTitle>
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

							<EditCan can={can} close={() => setOpen(false)} />

							<div className="flex justify-between items-center gap-4">
								<h4 className="text-lg text-destructive font-semibold">
									{t("danger_zone")}
								</h4>

								<DeleteCan
									can={can}
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

function EditCan({ can, close }: { can: TrashCan; close: () => void }) {
	const { t } = useTranslation();

	const [location, setLocation] = useState(can.location);
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();

	async function handleSave() {
		setLoading(true);
		try {
			await updateCan(can.id, {
				location,
			});

			setEditing(false);
			toast.success(t("can_updated"));
			queryClient.invalidateQueries({
				queryKey: ["garbage"],
			});
			close();
		} catch (err: any) {
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<div className="flex-1 space-y-2">
					<h4 className="text-lg text-primary font-semibold">
						{t("location")}
					</h4>
					{editing ? (
						<Input
							value={location}
							onChange={(e) => setLocation(e.target.value)}
							placeholder={t("location")}
							disabled={loading}
						/>
					) : (
						<p>{can.location}</p>
					)}
				</div>
				<div className="flex-1 space-y-2">
					<h4 className="text-lg text-primary font-semibold">
						{t("level")}
					</h4>
					<p>{can.level} %</p>
				</div>

				<div className="flex-1 space-y-2">
					<h4 className="text-lg text-primary font-semibold">
						{t("last_emptied")}
					</h4>
					<p className="text-sm">{dateTime(can.lastEmptied, "en")}</p>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				{editing ? (
					<>
						<Button
							variant="outline"
							onClick={() => setEditing(false)}
							disabled={loading}
						>
							{t("cancel")}
						</Button>
						<Button
							variant="success"
							onClick={handleSave}
							disabled={loading}
						>
							{loading ? (
								<UpdateIcon className="animate-spin me-2" />
							) : (
								<CheckIcon className="me-2" />
							)}
							{t("save")}
						</Button>
					</>
				) : (
					<Button variant="outline" onClick={() => setEditing(true)}>
						<Pencil2Icon className="me-2" />
						{t("edit")}
					</Button>
				)}
			</div>
		</div>
	);
}

function DeleteCan({ can, close }: { can: TrashCan; close: () => void }) {
	const { t } = useTranslation();
	const [isDeleting, setIsDeleting] = useState(false);

	const queryClient = useQueryClient();

	async function handleDelete() {
		setIsDeleting(true);

		try {
			await deleteCan(can.id);
			close();
			toast.success(t("can_deleted"));
			queryClient.invalidateQueries({
				queryKey: ["garbage"],
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
					<DialogTitle>{t("delete_can")}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p>{t("delete_can_warning")}</p>
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

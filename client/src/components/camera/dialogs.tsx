import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "~/contexts/translation";
import { deleteCamera, updateCamera } from "~/services/camera";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Pencil2Icon, TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

import type { Camera } from "~/services/camera";

export function EditCameraDialog({ camera }: { camera: Camera }) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const [formData, setFormData] = useState({
		location: camera.location,
		ip: camera.ip,
		tcp: camera.tcp,
	});
	const [formError, setFormError] = useState({
		location: "",
		ip: "",
		tcp: "",
	});

	const queryClient = useQueryClient();
	const updateMutation = useMutation({
		mutationFn: (data: Partial<Camera>) => updateCamera(camera.id, data),
		onSuccess: () => {
			toast.success(t("camera_updated"));
			queryClient.invalidateQueries({
				queryKey: ["cameras"],
			});
			setOpen(false);
		},
		onError: (err: APIError) => {
			console.error(err);
			if (err.error === "FORM_ERROR") {
				(err as APIFormError).messages.forEach((m) => {
					setFormError((prev) => ({
						...prev,
						[m.path]: m.message,
					}));
				});
			} else {
				toast.error((err as APIGenericError).message);
			}
		},
	});

	function handleSubmit() {
		updateMutation.mutate({
			...formData,
		});
	}

	function handleInputChange(key: string, value: string | boolean) {
		setFormData((prev) => ({
			...prev,
			[key]: value,
		}));
		setFormError((prev) => ({
			...prev,
			[key]: "",
		}));
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<Pencil2Icon />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("edit_camera")}</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<h4 className="text-lg text-primary font-semibold">
							{t("location")}
						</h4>
						<Input
							value={formData.location}
							onChange={(e) =>
								handleInputChange("location", e.target.value)
							}
							placeholder={t("location")}
							disabled={updateMutation.isPending}
						/>
						{formError.location && (
							<span className="text-destructive italic">
								{t(formError.location)}
							</span>
						)}
					</div>
					<div className="space-y-2">
						<h4 className="text-lg text-primary font-semibold">
							{t("conn_url")}
						</h4>
						<Input
							value={formData.ip}
							onChange={(e) =>
								handleInputChange("ip", e.target.value)
							}
							placeholder={"192.168.1.1"}
							disabled={updateMutation.isPending}
						/>
						{formError.ip && (
							<span className="text-destructive italic">
								{t(formError.ip)}
							</span>
						)}
					</div>
					<div className="space-y-2">
						<h4 className="text-lg text-primary font-semibold">
							{t("conn_proto")}
						</h4>
						<div className="flex items-center gap-4">
							<span className="text-md font-semibold">
								{t("udp")}
							</span>
							<Switch
								checked={formData.tcp}
								onCheckedChange={(c) =>
									handleInputChange("tcp", c)
								}
								disabled={updateMutation.isPending}
							/>
							<span className="text-md font-semibold">
								{t("tcp")}
							</span>
							{formError.tcp && (
								<span className="text-destructive italic">
									{t(formError.tcp)}
								</span>
							)}
						</div>
					</div>
				</div>
				<DialogFooter>
					<div className="flex justify-end items-center gap-2">
						<DialogClose asChild>
							<Button
								variant="outline"
								disabled={updateMutation.isPending}
							>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Button
							onClick={handleSubmit}
							disabled={updateMutation.isPending}
						>
							{updateMutation.isPending && (
								<UpdateIcon className="animate-spin me-2" />
							)}
							{t("submit")}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function DeleteCameraDialog({ camera }: { camera: Camera }) {
	const { t } = useTranslation();
	const [isDeleting, setIsDeleting] = useState(false);

	const queryClient = useQueryClient();

	async function handleDelete() {
		setIsDeleting(true);

		try {
			await deleteCamera(camera.id);
			toast.success(t("camera_deleted"));
			queryClient.invalidateQueries({
				queryKey: ["cameras"],
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
				<Button variant="destructive" size="icon">
					<TrashIcon />
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("delete_camera")}</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<p>{t("delete_camera_warning")}</p>
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

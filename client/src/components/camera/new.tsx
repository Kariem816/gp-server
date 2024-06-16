import { useState } from "react";
import { useTranslation } from "~/contexts/translation";
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
import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCamera } from "~/services/camera";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";

export function NewCamera() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">
					<PlusIcon className="me-2" />
					{t("new")}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("new_camera")}</DialogTitle>
				</DialogHeader>

				<NewCameraForm close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function NewCameraForm({ close }: { close: () => void }) {
	const { t } = useTranslation();

	const [formData, setFormData] = useState({
		location: "",
		ip: "",
		tcp: false,
	});
	const [formError, setFormError] = useState({
		location: "",
		ip: "",
		tcp: "",
	});

	const queryClient = useQueryClient();
	const createMutation = useMutation({
		mutationFn: createCamera,
		onSuccess: () => {
			toast.success(t("camera_created"));
			queryClient.invalidateQueries({
				queryKey: ["cameras"],
			});
			close();
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
		createMutation.mutate(formData);
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
		<>
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
						disabled={createMutation.isPending}
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
						placeholder={"198.168.1.1"}
						disabled={createMutation.isPending}
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
							onCheckedChange={(c) => handleInputChange("tcp", c)}
							disabled={createMutation.isPending}
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
							disabled={createMutation.isPending}
						>
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button
						onClick={handleSubmit}
						disabled={createMutation.isPending}
					>
						{createMutation.isPending && (
							<UpdateIcon className="animate-spin me-2" />
						)}
						{t("submit")}
					</Button>
				</div>
			</DialogFooter>
		</>
	);
}

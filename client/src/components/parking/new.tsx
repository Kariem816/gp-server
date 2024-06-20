import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "~/components/ui/dialog";
import { useTranslation } from "~/contexts/translation";
import { PlusIcon, UpdateIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { createParkingSpot } from "~/services/parking";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";

export function NewParkigSpot() {
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
					<DialogTitle>{t("new_parking")}</DialogTitle>
				</DialogHeader>

				<NewParkingForm close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function NewParkingForm({ close }: { close: () => void }) {
	const { t } = useTranslation();

	const [location, setLocation] = useState("");
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();

	async function handleSubmit() {
		setLoading(true);
		try {
			const newParkSpot = await createParkingSpot({location});
			await navigator.clipboard.writeText(newParkSpot.data.id);
			toast.success(t("parking_created"), {
				description: t("id_copied"),
			});
			queryClient.invalidateQueries({
				queryKey: ["parking"],
			});
			close();
		} catch (err: any) {
			console.error(err);
			toast.error(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="space-y-2">
				<h4 className="text-lg text-primary font-semibold">
					{t("location")}
				</h4>
				<Input
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					placeholder={t("location")}
					disabled={loading}
				/>
			</div>

			<DialogFooter>
				<div className="flex justify-end items-center gap-2">
					<DialogClose asChild>
						<Button variant="outline" disabled={loading}>
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button onClick={handleSubmit} disabled={loading}>
						{loading && (
							<UpdateIcon className="animate-spin me-2" />
						)}
						{t("submit")}
					</Button>
				</div>
			</DialogFooter>
		</>
	);
}

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
import { createPlant } from "~/services/irrigation";
import { toast } from "sonner";
import { Input } from "~/components/ui/input";

export function NewPlanetSpot() {
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
					<DialogTitle>{t("new_planet")}</DialogTitle>
				</DialogHeader>

				<NewPlanetForm close={() => setOpen(false)} />
			</DialogContent>
		</Dialog>
	);
}

function NewPlanetForm({ close }: { close: () => void }) {
	const { t } = useTranslation();

	const [type, setType] = useState("");
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();

	async function handleSubmit() {
		setLoading(true);
		try {
			const newPlanet = await createPlant({type});
			await navigator.clipboard.writeText(newPlanet.data.id);
			toast.success(t("planet_created"), {
				description: t("id_copied"),
			});
			queryClient.invalidateQueries({
				queryKey: ["irrigation"],
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
					{t("type")}
				</h4>
				<Input
					type={type}
					onChange={(e) => setType(e.target.value)}
					placeholder={t("type")}
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

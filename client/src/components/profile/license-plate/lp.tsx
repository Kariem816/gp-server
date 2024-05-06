import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogTrigger,
} from "~/components/ui/dialog";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { deleteLiscencePlate } from "~/services/users";
import { toArabicNumerals } from "~/utils/formatters/numbers";
import { separateLP } from ".";

export function LP({ lp }: { lp: string }) {
	const { refreshUser } = useAuth();
	const { t } = useTranslation();
	const { num, alpha } = useMemo(() => {
		return separateLP(lp);
	}, [lp]);

	const deleteLPMutation = useMutation({
		mutationFn: () => deleteLiscencePlate(),
		onSuccess: () => {
			toast.success(t("license_plate_deleted"));
			refreshUser();
		},
		onError: () => {
			toast.error(t("delete_license_plate_err"));
		},
	});

	return (
		<div className="border-4 rounded-md border-foreground inline-block w-full max-w-80 relative">
			<div className="h-10 bg-[#0a89ff]" />
			<hr className="h-1 border-none bg-foreground" />
			<div className="flex h-20">
				<div className="flex-grow px-2 flex items-center justify-center border-r-4 border-foreground">
					<span className="font-semibold text-lg">
						{toArabicNumerals(num).split("").reverse().join(" ")}
					</span>
				</div>
				<div className="flex-grow px-2 flex items-center justify-center">
					<span className="font-semibold text-lg">
						{alpha.split("").join(" ")}
					</span>
				</div>
			</div>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant="destructive"
						size="icon"
						className="absolute -bottom-4 -end-4 rounded-full"
					>
						<TrashIcon className="size-6" />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<p className="text-center text-xl font-semibold">
						{t("delete_license_plate")}
					</p>
					<div className="flex gap-2 justify-end items-center">
						<DialogClose asChild>
							<Button variant="outline">{t("cancel")}</Button>
						</DialogClose>
						<Button
							variant="destructive"
							onClick={() => deleteLPMutation.mutateAsync()}
						>
							{deleteLPMutation.isPending && (
								<UpdateIcon className="size-6 animate-spin me-2" />
							)}
							{t("delete")}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

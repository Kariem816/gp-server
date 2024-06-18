import { TrashIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
import { useTranslation } from "~/contexts/translation";
import { deleteUser } from "~/services/users";

import type { LoggedUser } from "~/types/users";

export function DeleteController({ controller }: { controller: LoggedUser }) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const deleteControllerMutation = useMutation({
		mutationFn: () => deleteUser(controller.id),
		onSuccess: () => {
			toast.success(t("controller_deleted"));
			queryClient.invalidateQueries({
				queryKey: ["controllers"],
			});
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

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
					<DialogTitle>{t("delete_controller")}</DialogTitle>
					<DialogDescription>
						{t("delete_controller_desc", controller.name)}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">{t("cancel")}</Button>
					</DialogClose>
					<Button
						variant="destructive"
						onClick={() => deleteControllerMutation.mutateAsync()}
						disabled={deleteControllerMutation.isPending}
					>
						{deleteControllerMutation.isPending && (
							<UpdateIcon className="me-2 animate-spin" />
						)}
						{t("delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

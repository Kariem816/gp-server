import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { deleteUser } from "~/services/users";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
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
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import type { LoggedUser } from "~/types/users";

export default function DangerZone({
	user,
	authUser,
}: {
	user: LoggedUser;
	authUser: LoggedUser;
}) {
	const { t } = useTranslation();
	const { logout } = useAuth();

	const [isAOpened, setIsAOpened] = useState(false);
	const [isBOpened, setIsBOpened] = useState(false);

	const navigate = useNavigate();

	const deleteUserMutation = useMutation({
		mutationFn: () => deleteUser(user.id),
		onSuccess: () => {
			close();
			toast.success(t("account_deleted"));
			if (user.id === authUser.id) {
				logout();
			} else {
				navigate({ to: "/admin/users" });
			}
		},
		onError: (err: any) => {
			close();
			toast.error(err.message);
		},
	});

	function close() {
		if (!deleteUserMutation.isPending) {
			setIsAOpened(false);
			setIsBOpened(false);
		}
	}

	return (
		<Dialog open={isAOpened} onOpenChange={setIsAOpened}>
			<DialogTrigger asChild>
				<Button variant="destructive">{t("delete_account")}</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("delete_account")}</DialogTitle>
					<DialogDescription>
						{t("delete_account_desc")}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<div className="flex justify-end items-center gap-2">
						<DialogClose>
							<Button
								variant="outline"
								disabled={deleteUserMutation.isPending}
							>
								{t("cancel")}
							</Button>
						</DialogClose>
						<Dialog open={isBOpened} onOpenChange={setIsBOpened}>
							<DialogTrigger asChild>
								<Button
									variant="destructive"
									disabled={deleteUserMutation.isPending}
								>
									{t("delete")}
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>
										{t("delete_account")}
									</DialogTitle>
									<DialogDescription>
										{t("delete_account_desc")}
									</DialogDescription>
								</DialogHeader>

								<p className="flex flex-wrap items-center gap-2 text-destructive font-semibold">
									<span>
										<ExclamationTriangleIcon className="size-6" />
									</span>
									<span>{t("confirmation")}</span>
								</p>

								<DialogFooter>
									<div className="flex justify-end items-center gap-2">
										<Button
											variant="outline"
											disabled={
												deleteUserMutation.isPending
											}
											onClick={close}
										>
											{t("cancel")}
										</Button>
										<Button
											variant="destructive"
											disabled={
												deleteUserMutation.isPending
											}
											onClick={() =>
												deleteUserMutation.mutate()
											}
										>
											{t("affirmative")}
										</Button>
									</div>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

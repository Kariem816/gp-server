import { On } from "~/components/on";
import { useTranslation } from "~/contexts/translation";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { LP } from "./lp";
import { EditDialog } from "./edit-dialog";

import type { LoggedUser } from "~/types/users";

export function separateLP(lp: string) {
	const num = parseInt(lp).toString();
	const alpha = lp.replace(num.toString(), "").trim();

	return {
		num,
		alpha,
	};
}

export default function LicsensePlate({
	user,
	authUser,
}: {
	user: LoggedUser;
	authUser: LoggedUser;
}) {
	const [open, setOpen] = useState(false);

	const { t } = useTranslation();

	if (
		user.role === "controller" ||
		user.role === "security" ||
		user.role === "student"
	)
		return null;

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4">
				<h4 className="text-lg font-semibold text-primary">
					{t("license_plate")}
				</h4>
				<On condition={user.id === authUser.id}>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon">
								{user.licensePlate ? (
									<Pencil2Icon className="text-yellow-400" />
								) : (
									<PlusIcon className="text-primary" />
								)}
							</Button>
						</DialogTrigger>
						<DialogContent>
							<EditDialog
								lisensePlate={user.licensePlate}
								dismiss={() => setOpen(false)}
							/>
						</DialogContent>
					</Dialog>
				</On>
			</div>
			{user.licensePlate ? (
				<LP lp={user.licensePlate} />
			) : (
				<span>{t("no_saved_plate")}</span>
			)}
		</div>
	);
}

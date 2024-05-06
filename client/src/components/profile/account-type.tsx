import { useTranslation } from "~/contexts/translation";
import { Link } from "@tanstack/react-router";

import type { LoggedUser } from "~/types/users";

export default function AccountType({ user }: { user: LoggedUser }) {
	const { t } = useTranslation();

	return (
		<div className="flex items-end gap-4">
			<h4 className="text-lg font-semibold text-primary">
				{t("account_type")}
			</h4>
			{user.role === "admin" ? (
				<span>{t(user.role)}</span>
			) : (
				<Link
					// @ts-expect-error Too lazy to fix
					to={`/${user.role}s/${user[user.role].id}`}
					className="hover:underline"
				>
					{t(user.role)}
				</Link>
			)}
		</div>
	);
}

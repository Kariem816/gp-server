import { On } from "~/components/on";
import { useTranslation } from "~/contexts/translation";
import { useAuth } from "~/contexts/auth";

import ProfileHeader from "./profile-header";
import AccountType from "./account-type";
import LicsensePlate from "./license-plate";
import UserImages from "./user-imgs";
import ChangePassword from "./change-password";
import Notify from "./notify";
import DangerZone from "./danger-zone";

import type { LoggedUser } from "~/types/users";

export default function Profile({ user }: { user: LoggedUser }) {
	const { user: authUser } = useAuth();
	const { t } = useTranslation();

	if (authUser.role === "guest") {
		console.error(
			"Unreachable. The above hook should have redirected to login page."
		);
		return null;
	}

	return (
		<div className="container py-4 space-y-4">
			<ProfileHeader user={user} />

			<AccountType user={user} />

			<LicsensePlate user={user} authUser={authUser} />

			<UserImages userId={user.id} />

			<On condition={user.id === authUser.id}>
				<div>
					<h4 className="text-lg font-semibold text-primary">
						{t("settings")}
					</h4>
					<ChangePassword />
				</div>
			</On>

			<On condition={authUser.role === "admin"}>
				<div>
					<h4 className="text-lg font-semibold text-primary">
						{t("notifications")}
					</h4>

					<Notify user={user} />
				</div>
			</On>

			<On
				condition={user.id === authUser.id || authUser.role === "admin"}
			>
				<div className="space-y-2">
					<h4 className="text-lg font-semibold text-destructive">
						{t("danger_zone")}
					</h4>
					<DangerZone user={user} authUser={authUser} />
				</div>
			</On>
		</div>
	);
}

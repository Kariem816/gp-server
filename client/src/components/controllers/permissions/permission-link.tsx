import { TrashIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";

export function PermissionLink({ permission }: { permission: string }) {
	const { t } = useTranslation();

	// TODO: install react-icons for wider range of icons
	switch (permission) {
		case "parking":
			return (
				<Button asChild variant="outline">
					<Link to="/monitor/parking">{t("parking")}</Link>
				</Button>
			);
		case "garbage":
			return (
				<Button asChild variant="outline">
					<Link to="/monitor/garbage">
						<TrashIcon className="me-2 size-6" />
						{t("garbage")}
					</Link>
				</Button>
			);
		case "irrigation":
			return (
				<Button asChild variant="outline">
					<Link to="/monitor/irrigation">{t("irrigation")}</Link>
				</Button>
			);
		case "lighting":
			return (
				<Button asChild variant="outline">
					<Link to="/monitor/lighting">{t("lighting")}</Link>
				</Button>
			);
		default:
			return (
				<Button asChild variant="outline">
					<a href="#">{t(permission)}</a>
				</Button>
			);
	}
}

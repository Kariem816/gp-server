import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";

export const Route = createFileRoute("/password-reset/")({
	component: PasswordResetPage,
});

function PasswordResetPage() {
	const { t, isRTL } = useTranslation();

	return (
		<div className="container h-full flex flex-col justify-center items-center gap-4">
			<h1 className="text-2xl text-center font-bold italic text-muted-foreground">
				{t("forgot_password_phrase")}
			</h1>

			<Button asChild>
				<Link to="/login" replace>
					{isRTL ? (
						<ArrowRightIcon className="me-2" />
					) : (
						<ArrowLeftIcon className="me-2" />
					)}
					{t("back")}
				</Link>
			</Button>
		</div>
	);
}

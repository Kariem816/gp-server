import type { ErrorComponentProps } from "@tanstack/react-router";
import { useTranslation } from "~/contexts/translation";
import { Button } from "~/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export function ErrorComponent({ error, reset }: ErrorComponentProps) {
	const { t } = useTranslation();

	return (
		<div className="container my-24 h-full flex flex-col justify-center items-center gap-4">
			<h1 className="text-4xl font-semibold text-destructive">
				{t("generic_error")}
			</h1>
			<p className="text-lg italic">{t(error.message)}</p>
			<div>
				<Button onClick={reset}>
					<ReloadIcon className="me-2" />
					{t("refresh")}
				</Button>
			</div>
		</div>
	);
}

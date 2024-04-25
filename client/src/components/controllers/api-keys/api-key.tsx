import {
	CheckIcon,
	CopyIcon,
	CountdownTimerIcon,
	EyeNoneIcon,
	EyeOpenIcon,
	TrashIcon,
	UpdateIcon,
} from "@radix-ui/react-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { useTranslation } from "~/contexts/translation";
import { rollApiKey, type TAPIKey } from "~/services/controllers";
import { cn } from "~/utils";
import { dateTime } from "~/utils/formatters/time";

export function APIKey({ apikey }: { apikey: TAPIKey }) {
	const [hidden, setHidden] = useState(true);
	const [copied, setCopied] = useState(false);
	const [rolling, setRolling] = useState(false);

	const { t, language } = useTranslation();
	const queryClient = useQueryClient();

	const isValid = useMemo(
		() =>
			apikey.expiresAt ? new Date(apikey.expiresAt) > new Date() : true,
		[apikey.expiresAt]
	);

	function copy() {
		if (copied) return;
		navigator.clipboard.writeText(apikey.key);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	async function roll() {
		if (rolling) return;
		setRolling(true);
		try {
			await rollApiKey(apikey.id);
			toast.success(t("key_rolled"));
			await queryClient.invalidateQueries({
				queryKey: ["my-api-keys"],
			});
			// eslint-disable-next-line
		} catch (error: any) {
			toast.error(error.message);
		} finally {
			setRolling(false);
		}
	}

	return (
		<div className="rounded-lg bg-accent p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h6 className="font-semibold text-lg">{apikey.name}</h6>
				<span title={t(isValid ? "valid" : "expired")}>
					{isValid ? (
						<CheckIcon className="text-emerald-400 size-6" />
					) : (
						<CountdownTimerIcon className="text-destructive size-6" />
					)}
				</span>
			</div>
			<p>
				{t("created_at")} {dateTime(apikey.createdAt, language)}
			</p>
			{apikey.expiresAt && (
				<p>
					{t("expires_at")} {dateTime(apikey.expiresAt, language)}
				</p>
			)}
			<p
				className={cn(
					"text-sm text-accent-6 flex-grow",
					hidden && "blur-md pointer-events-none select-none"
				)}
			>
				{apikey.key}
			</p>
			<div className="flex justify-end gap-2">
				<Button
					onClick={roll}
					size="icon"
					variant="destructive"
					title={t("roll_key")}
				>
					{rolling ? (
						<UpdateIcon className="animate-spin" />
					) : (
						<TrashIcon />
					)}
				</Button>
				<Button onClick={copy} size="icon" title={t("copy")}>
					{copied ? <CheckIcon /> : <CopyIcon />}
				</Button>
				<Button
					onClick={() => setHidden((prev) => !prev)}
					size="icon"
					variant="outline"
					title={t(hidden ? "show" : "hide")}
				>
					{hidden ? <EyeNoneIcon /> : <EyeOpenIcon />}
				</Button>
			</div>
		</div>
	);
}

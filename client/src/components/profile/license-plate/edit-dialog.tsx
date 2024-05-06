import { useState } from "react";
import { separateLP } from ".";
import { useAuth } from "~/contexts/auth";
import { useTranslation } from "~/contexts/translation";
import { useMutation } from "@tanstack/react-query";
import { toEnglishNumerals } from "~/utils/formatters/numbers";
import { updateLiscencePlate } from "~/services/users";
import { toast } from "sonner";
import {
	DialogTitle,
	DialogFooter,
	DialogHeader,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

export function EditDialog({
	lisensePlate,
	dismiss,
}: {
	lisensePlate?: string;
	dismiss: () => void;
}) {
	const [num, setNums] = useState(
		lisensePlate ? separateLP(lisensePlate).num : ""
	);
	const [alpha, setAlpha] = useState(
		lisensePlate ? separateLP(lisensePlate).alpha : ""
	);
	const [numError, setNumError] = useState("");
	const [alphaError, setAlphaError] = useState("");
	const [lpError, setLPError] = useState("");

	const { refreshUser } = useAuth();
	const { t } = useTranslation();

	const updateLPMutation = useMutation({
		mutationFn: async () => {
			const tNums = num
				.split("")
				.filter((l) => l.trim())
				.join("");
			const fNums = toEnglishNumerals(tNums);

			const tAlpha = alpha
				.split("")
				.filter((l) => l.trim())
				.join("");

			await updateLiscencePlate(`${fNums}${tAlpha}`);
		},
		onSuccess: () => {
			toast.success(t("license_plate_updated"));
			dismiss();

			refreshUser();
		},
		onError: (err: any) => {
			if (err.error === "FORM_ERROR") {
				setLPError(err.messages[0].message);
			} else if ("message" in err) {
				setLPError(err.message);
			} else {
				toast.error(t("update_license_plate_err"));
			}
		},
	});

	function handleNumChange(text: string) {
		setNumError("");

		const allowedNums = "١٢٣٤٥٦٧٨٩123456789";
		const notAllowedNums = "٠0";

		let fText = "";
		let err = false;
		let errNotAllowed = false;

		for (const l of text) {
			if (allowedNums.includes(l)) {
				fText += toEnglishNumerals(l);
			} else if (notAllowedNums.includes(l)) {
				errNotAllowed = true;
			} else if (l !== " ") {
				err = true;
			}
		}

		if (err) {
			setNumError(t("nums_only"));
		}
		if (errNotAllowed) {
			setNumError(t("not_allowed_num"));
		}
		setNums(fText);
	}

	function handleAlphaChange(text: string) {
		setAlphaError("");
		const allowedLetters = "أبجدرسصطعفقلمنهوى";
		const alef = "اإآ";
		const yaa = "ي";
		const notAllowedLetters = "ؤءئةتثحخذزشضظغكي";

		let fText = "";
		let err = false;
		let errNotAllowed = false;

		for (const l of text) {
			if (allowedLetters.includes(l)) {
				fText += l;
			} else if (alef.includes(l)) {
				fText += "أ";
			} else if (yaa.includes(l)) {
				fText += "ى";
			} else if (notAllowedLetters.includes(l)) {
				errNotAllowed = true;
			} else if (l !== " ") {
				err = true;
			}
		}

		if (err) {
			setAlphaError(t("arabic_letters_only"));
		}
		if (errNotAllowed) {
			setAlphaError(t("letter_not_allowed"));
		}
		setAlpha(fText);
	}

	function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter") {
			updateLPMutation.mutateAsync();
		}
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>
					{t(lisensePlate ? "new_plate" : "add_plate")}
				</DialogTitle>
			</DialogHeader>

			<div className="border-4 rounded-md overflow-hidden border-foreground">
				<div className="h-10 bg-[#0a89ff]" />
				<hr className="h-1 border-none bg-foreground" />
				<div className="flex h-20">
					<div className="flex-grow p-1 space-y-2">
						<Input
							value={num.split("").join(" ")}
							onChange={(e) => handleNumChange(e.target.value)}
							onKeyUp={handleKey}
							placeholder="٢ ٥ ٩"
							className="w-full text-center font-semibold border-none outline-none tracking-widest"
							maxLength={7}
						/>
						{numError && (
							<p className="text-destructive">{numError}</p>
						)}
					</div>
					<div className="w-1 bg-foreground" />
					<div className="flex-grow p-1 space-y-2">
						<Input
							value={alpha.split("").join(" ")}
							onChange={(e) => handleAlphaChange(e.target.value)}
							onKeyUp={handleKey}
							placeholder="ن ط ب"
							className="text-center font-semibold border-none outline-none tracking-widest"
							maxLength={5}
						/>
						{alphaError && (
							<p className="text-destructive">{alphaError}</p>
						)}
					</div>
				</div>
			</div>

			{lpError && <span className="text-destructive">{lpError}</span>}

			<DialogFooter>
				<div className="flex justify-end items-center gap-2">
					<Button
						variant="outline"
						onClick={dismiss}
						disabled={updateLPMutation.isPending}
					>
						{t("cancel")}
					</Button>
					<Button
						variant="success"
						onClick={() => updateLPMutation.mutateAsync()}
						disabled={
							updateLPMutation.isPending ||
							!!numError ||
							!!alphaError
						}
					>
						<CheckIcon className="me-2" />
						{t("save")}
					</Button>
				</div>
			</DialogFooter>
		</>
	);
}

import { useTranslation } from "~/contexts/translation";
import { useState } from "react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import type { ChangeEvent, ReactNode } from "react";

type LectureData = {
	time: Date;
	duration: number;
	location: string;
};

interface LectureProps {
	initialData?: Partial<LectureData>;

	onSubmit: (data: LectureData) => void;

	title: string;
	Btn: ReactNode;

	isLoading?: boolean;
	isDisabled?: boolean;
}

export default function LectureModal({
	initialData,
	onSubmit,
	title,
	Btn,
	// isLoading = false,
	isDisabled = false,
}: LectureProps) {
	const { t } = useTranslation();

	const [formdata, setFormData] = useState(() => {
		const now = new Date();
		now.setDate(now.getDate() + 7);
		now.setSeconds(0, 0);
		return {
			duration: 110,
			location: "",
			...initialData,
			time: initialData?.time ? new Date(initialData.time) : now,
		};
	});

	function handleTimeChange(e: ChangeEvent<HTMLInputElement>) {
		const time = new Date(e.target.valueAsNumber);
		setFormData((prev) => ({ ...prev, time }));
	}

	function handleSubmit() {
		onSubmit(formdata);
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{Btn}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t(title)}</DialogTitle>
				</DialogHeader>

				<div>
					<Label htmlFor="time">{t("time")}</Label>
					<Input
						id="time"
						type="datetime-local"
						className="text-center"
						value={formdata.time.toISOString().replace("Z", "")}
						onChange={handleTimeChange}
						step={60000}
					/>
				</div>

				<div>
					<Label htmlFor="duration">{t("duration")}</Label>
					<div className="flex items-center gap-2">
						<Input
							id="duration"
							type="number"
							value={formdata.duration}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									duration: Number(e.target.value),
								}))
							}
							placeholder="110"
							step="5"
							min="0"
						/>
						<span className="font-semibold">{t("mins")}</span>
					</div>
				</div>

				<div>
					<Label>{t("location")}</Label>
					<Input
						value={formdata.location}
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								location: e.target.value,
							}))
						}
						placeholder="Hall A"
					/>
				</div>

				<div className="flex justify-end gap-4">
					<DialogClose asChild>
						<Button className="rounded-lg" variant="outline">
							{t("cancel")}
						</Button>
					</DialogClose>
					<Button
						className="rounded-lg"
						// loading={isLoading}
						disabled={isDisabled}
						onClick={handleSubmit}
					>
						{t("submit")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

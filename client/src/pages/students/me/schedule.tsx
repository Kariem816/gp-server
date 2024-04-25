import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Spinner } from "~/components/loaders";
import { Input } from "~/components/ui/input";
import { useTranslation } from "~/contexts/translation";
import { getMySchedule } from "~/services/students";

function formatDate(date: Date) {
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

export const Route = createFileRoute("/students/me/schedule")({
	component: MySchedule,
});

function MySchedule() {
	const { t } = useTranslation();

	const [date, setDate] = useState(() => {
		// Set date to next week
		const now = new Date();
		now.setHours(0, 0, 0, 0);
		now.setDate(now.getDate() + 7);
		return now;
	});
	const {
		data: schedule,
		isLoading,
		isError,
		error,
	} = useQuery({
		queryKey: ["student-schedule", date.toDateString()],
		queryFn: () => getMySchedule(date),
		select: (data) => data.data,
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 p-4">
			<div className="flex justify-end gap-2 items-center">
				<p className="text-nowrap">{t("showing_schedule")}</p>
				<div>
					<Input
						type="date"
						value={formatDate(date)}
						onChange={(e) => setDate(new Date(e.target.value))}
					/>
				</div>
			</div>

			{isLoading ? (
				<div className="h-full grid place-items-center">
					<Spinner />
				</div>
			) : schedule.length > 0 ? (
				<div className="space-y-4">Not Implemented</div>
			) : (
				<p className="text-center opacity-75 italic">
					{t("no_schedule")}
				</p>
			)}
		</div>
	);
}

import { CameraIcon, PlusCircledIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LectureAttendance } from "~/components/lectures/attendance";
import { AutoAttendance } from "~/components/lectures/auto-attendance";
import { ManualAttendance } from "~/components/lectures/manual-attendance";
import { Spinner } from "~/components/loaders";
import { Pagination } from "~/components/pagination";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { useTranslation } from "~/contexts/translation";
// import useLectureTime from "~/hooks/lectures/use-lecture-time";
import { usePaginatedQuery } from "~/hooks/use-paginated-query";
import { getLecture, getLectureAttendees } from "~/services/lectures";

export const Route = createFileRoute("/lectures/$id/attendance")({
	component: LectureAttendancePage,
});

function LectureAttendancePage() {
	const { id: lectureId } = Route.useParams();
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);

	const {
		data: lecture,
		isLoading: isLectureLoading,
		isError: isLectureError,
		error: lectureError,
	} = useQuery({
		queryKey: ["lecture", lectureId],
		queryFn: () => getLecture(lectureId),
		select: (data) => data.data,
	});

	const {
		data: attendees,
		pages,
		page,
		setPage,
		refetch,
		isRefetching,
		isLoading: isAttendeesLoading,
		isError: isAttendeesError,
		error: attendeesError,
	} = usePaginatedQuery({
		queryKey: ["lecture-attendance", lectureId],
		queryFn: (pagination) => getLectureAttendees(lectureId, pagination),
		options: {
			initialPage: 1,
			initialLimit: 25,
		},
	});

	// const { timing } = useLectureTime(lecture);

	if (isLectureError || isAttendeesError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">
					{lectureError?.message ?? attendeesError?.message}
				</p>
			</div>
		);
	}

	if (isLectureLoading || !lecture || isAttendeesLoading || !attendees) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<div className="container">
				<div className="flex justify-center flex-wrap-reverse p-4 gap-4">
					<Pagination page={page} pages={pages} onChange={setPage} />

					<div className="flex justify-end items-center gap-2">
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								<Button size="icon" title={t("auto")}>
									<CameraIcon />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{t("attendance")}</DialogTitle>
								</DialogHeader>

								<AutoAttendance
									lectureId={lectureId}
									close={() => setOpen(false)}
								/>
							</DialogContent>
						</Dialog>

						<Dialog>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									title={t("manual")}
								>
									<PlusCircledIcon />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>{t("manual")}</DialogTitle>
								</DialogHeader>

								<ManualAttendance />
							</DialogContent>
						</Dialog>

						<Button
							variant="ghost"
							size="icon"
							onClick={() => refetch()}
						>
							<UpdateIcon
								className={isRefetching ? "animate-spin" : ""}
							/>
						</Button>
					</div>
				</div>
			</div>

			<hr />

			<div className="container p-4">
				<LectureAttendance lecture={lecture} attendees={attendees} />
			</div>
		</>
	);
}

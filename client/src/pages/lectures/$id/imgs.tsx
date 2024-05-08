import { InfoCircledIcon, UpdateIcon } from "@radix-ui/react-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Dots, Spinner } from "~/components/loaders";
import { Obsevable } from "~/components/observable";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useTranslation } from "~/contexts/translation";
import { getLectureImgs } from "~/services/lectures";
import { cn } from "~/utils";
import { time } from "~/utils/formatters/time";

export const Route = createFileRoute("/lectures/$id/imgs")({
	component: LectureImages,
});

function LectureImages() {
	const { id: lectureId } = Route.useParams();
	const { t } = useTranslation();

	const {
		data,
		fetchNextPage,
		isFetchingNextPage,
		isFetching,
		refetch,
		isRefetching,
		hasNextPage,
		isError,
		error,
	} = useInfiniteQuery({
		queryKey: ["lecture-imgs", lectureId],
		queryFn: ({ pageParam }) =>
			getLectureImgs(lectureId, { page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			const pages = lastPage.total / lastPage.limit;
			return lastPage.page < pages ? lastPage.page + 1 : undefined;
		},
		getPreviousPageParam: (firstPage) => {
			return firstPage.page > 1 ? firstPage.page - 1 : undefined;
		},
		select: (data) => data.pages.flatMap((page) => page.data),
	});

	if (isError) {
		return (
			<div className="h-full grid place-items-center">
				<p className="text-destructive italic">{error.message}</p>
			</div>
		);
	}

	if (isFetching) {
		return (
			<div className="h-full grid place-items-center">
				<Spinner />
			</div>
		);
	}

	return (
		<>
			<div className="flex justify-end container pt-2">
				<Button variant="outline">
					<UpdateIcon
						className={cn(
							isRefetching && "animate-spin",
							"sm:me-2"
						)}
					/>
					<span className="hidden sm:block">{t("refresh")}</span>
				</Button>
			</div>
			<div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 p-4">
				{data?.map((img) => <ImageItem key={img.id} img={img} />)}
			</div>
			{data?.length === 0 && (
				<div className="h-full grid place-items-center">
					<p className="italic">{t("no_imgs")}</p>
				</div>
			)}
			{hasNextPage && <Obsevable onAppearance={() => fetchNextPage()} />}
			{isFetchingNextPage && <Dots />}
		</>
	);
}

function ImageItem({
	img,
}: {
	img: {
		id: string;
		img: string;
		students: number;
		capturedAt: string;
		faces: number;
		processed: boolean;
	};
}) {
	const { t, language } = useTranslation();

	return (
		<div className="p-4 relative grid place-items-center">
			<img
				loading="lazy"
				src={img.img}
				alt={img.capturedAt}
				className="w-full object-cover"
			/>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						className="absolute bottom-0 end-0 p-0 rounded-full"
						size="icon"
					>
						<InfoCircledIcon />
					</Button>
				</DialogTrigger>
				<DialogContent>
					<div className="container space-y-2">
						<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
							<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-28">
								{t("captured_at")}
							</h4>
							<span className="text-lg font-semibold xs:flex-grow">
								{time(img.capturedAt, language)}
							</span>
						</div>
						<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
							<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-28">
								{t("students")}
							</h4>
							<span className="text-lg font-semibold xs:flex-grow">
								{img.students}
							</span>
						</div>
						<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
							<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-28">
								{t("faces")}
							</h4>
							<span className="text-lg font-semibold xs:flex-grow">
								{img.faces}
							</span>
						</div>
						<div className="flex items-center gap-x-4 flex-wrap xs:flex-nowrap">
							<h4 className="text-lg text-primary font-semibold xs:text-end xs:min-w-28">
								{t("processed")}
							</h4>
							<span className="text-lg font-semibold xs:flex-grow">
								{t(img.processed ? "yes" : "no")}
							</span>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

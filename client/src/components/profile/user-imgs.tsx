import { useTranslation } from "~/contexts/translation";
// import { On } from "~/components/on";
// import { useState } from "react";
import { Spinner } from "~/components/loaders";
import { useAuth } from "~/contexts/auth";
import { getMyImages, getUserImages } from "~/services/users";
import { useQuery } from "@tanstack/react-query";

export default function UserImages({ userId }: { userId: string }) {
	// const [open, setOpen] = useState(false);
	const { user: authUser } = useAuth();
	const { t } = useTranslation();

	const {
		data: imgs,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["user-imgs", userId],
		queryFn: () =>
			(authUser.role === "guest" ? "unreachable" : authUser.id) === userId
				? getMyImages()
				: getUserImages(userId),
		select: (data) => data.data,
		enabled: authUser.role !== "guest",
	});

	if (authUser.role === "guest") {
		console.error("Unreachable");
		return null;
	}

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4">
				<h4 className="text-lg font-semibold text-primary">
					{t("imgs")}
				</h4>
				{/* TODO: implement multi upload if we really need it */}
				{/* <On condition={userId === authUser.id}>
					<Dialog open={open} onOpenChange={setOpen}>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon">
								<PlusIcon className="text-primary" />
							</Button>
						</DialogTrigger>
						<DialogContent>Content</DialogContent>
					</Dialog>
				</On> */}
			</div>
			{isError ? (
				<div className="h-full grid place-items-center">
					<p className="text-destructive italic">
						{t("imgs_load_err")}
					</p>
				</div>
			) : isPending ? (
				<div className="h-full grid place-items-center">
					<Spinner />
				</div>
			) : imgs && imgs.length > 0 ? (
				<div className="flex overflow-x-auto gap-4 pb-4">
					{imgs.map((img, i) => (
						<img
							key={i}
							src={img}
							alt="User Image"
							className="size-24 border object-cover rounded-md shadow-md"
						/>
					))}
				</div>
			) : (
				<div className="h-full grid place-items-center">
					<p className="text-center italic">{t("no_imgs")}</p>
				</div>
			)}
		</div>
	);
}

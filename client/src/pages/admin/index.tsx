import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
	component: () => (
		<div className="text-center h-full flex justify-center items-center font-bold text-2xl">
			You should not be here.
		</div>
	),
	beforeLoad: () => {
		throw redirect({
			to: "/admin/users",
			replace: true,
		});
	},
});

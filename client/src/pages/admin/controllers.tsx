import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/controllers")({
	component: AdminControllers,
});

function AdminControllers() {
	return (
		<div className="text-center h-full flex justify-center items-center font-bold text-2xl">
			Under Construction
		</div>
	);
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/lectures/$id/attendance")({
	component: () => (
		<div className="text-center h-full flex justify-center items-center font-bold text-2xl">
			Under Construction
		</div>
	),
});

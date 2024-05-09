import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/password-reset/")({
	component: () => (
		<div className="text-center h-full flex justify-center items-center font-bold text-2xl">
			Please contact the administrator  
		</div>
	),
});

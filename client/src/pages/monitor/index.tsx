import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/monitor/")({
	component: () => (
		<p className="italic text-center">Choose a controller to monitor</p>
	),
});

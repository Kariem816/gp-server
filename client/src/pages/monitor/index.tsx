import { createFileRoute } from "@tanstack/react-router";
  
export const Route = createFileRoute("/monitor/")({
	component: () => (
		<div className="flex items-center justify-center">
  			<h3 className="text-black">Please select the Monitor you want</h3>
		</div>
	),
});
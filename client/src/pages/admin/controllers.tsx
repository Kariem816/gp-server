import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/controllers")({
	component: AdminControllers,
});

function AdminControllers() {
	return <div>placeholder</div>;
}

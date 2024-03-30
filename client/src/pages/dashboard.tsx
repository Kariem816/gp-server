import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";
import { useSecurePage } from "~/hooks/useSecurePage";
import AdminDashboardLayout from "~/components/dashboard/admin/layout";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const { user } = useAuth();
	const showPage = useSecurePage();

	if (showPage === "redirect") return <Navigate to="/login" replace />;
	if (showPage === "deny")
		return (
			<div>
				<h1>Access Denied</h1>
				<p>You do not have permission to access this page.</p>
			</div>
		);

	if (user.role === "admin") {
		return <AdminDashboardLayout />;
	}

	if (user.role === "teacher") {
		return (
			<div>
				<h1>User Dashboard</h1>
				<p>Welcome, {user.username}!</p>
			</div>
		);
	}

	if (user.role === "student") {
		return (
			<div>
				<h1>Student Dashboard</h1>
				<p>Welcome, {user.username}!</p>
			</div>
		);
	}

	if (user.role === "controller") {
		return (
			<div>
				<h1>Controller Dashboard</h1>
				<p>Welcome, {user.username}!</p>
			</div>
		);
	}

	if (user.role === "security") {
		return (
			<div>
				<h1>Security Dashboard</h1>
				<p>Welcome, {user.username}!</p>
			</div>
		);
	}
}

import { UserRole } from "~/types/users";

type NavRoute = {
	name: string;
	path: string;
	icon?: JSX.Element;
};

const HOME_ROUTE: NavRoute = { name: "Home", path: "/" };
const APP_MONITOR_TEMP_ROUTE: NavRoute = {
	name: "App Monitor",
	path: "/monitor",
};
const MOBILE_ROUTE: NavRoute = { name: "Mobile", path: "/mobile" };
const ADMIN_DASHBOARD_ROUTE: NavRoute = { name: "Dashboard", path: "/admin" };
const STUDENT_DASHBOARD_ROUTE: NavRoute = {
	name: "Dashboard",
	path: "/students/me",
};
const TEACHER_DASHBOARD_ROUTE: NavRoute = {
	name: "Dashboard",
	path: "/teachers/me",
};
const SECURITY_DASHBOARD_ROUTE: NavRoute = {
	name: "Dashboard",
	path: "/security/me",
};
const CONTROLLER_DASHBOARD_ROUTE: NavRoute = {
	name: "Dashboard",
	path: "/controllers/me",
};

export function generateNavRoutes(userRole: UserRole | "guest"): NavRoute[] {
	const routes: NavRoute[] = [HOME_ROUTE];

	if (userRole === "admin") {
		routes.push(ADMIN_DASHBOARD_ROUTE);
	}

	if (userRole === "teacher") {
		routes.push(TEACHER_DASHBOARD_ROUTE);
	}

	if (userRole === "student") {
		routes.push(STUDENT_DASHBOARD_ROUTE);
	}

	if (userRole === "security") {
		routes.push(SECURITY_DASHBOARD_ROUTE);
	}

	if (userRole === "controller") {
		routes.push(CONTROLLER_DASHBOARD_ROUTE);
	}

	routes.push(APP_MONITOR_TEMP_ROUTE, MOBILE_ROUTE);

	return routes;
}

import { UserRole } from "~/types/users";

type NavRoute = {
	name: string;
	path: string;
	icon?: JSX.Element;
};

const HOME_ROUTE: NavRoute = { name: "home", path: "/" };
const COURSES_ROUTE: NavRoute = { name: "courses", path: "/courses" };
const APP_MONITOR_ROUTE: NavRoute = {
	name: "app_monitor",
	path: "/monitor",
};
const MOBILE_ROUTE: NavRoute = { name: "mobile", path: "/mobile" };
const ADMIN_DASHBOARD_ROUTE: NavRoute = { name: "dashboard", path: "/admin" };
const STUDENT_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/students/me/",
};
const TEACHER_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/teachers/me/",
};
const SECURITY_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/security/me/",
};
const CONTROLLER_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/controllers/me/",
};

export function generateNavRoutes(userRole: UserRole | "guest"): NavRoute[] {
	const routes: NavRoute[] = [HOME_ROUTE];

	if (userRole === "admin") {
		routes.push(ADMIN_DASHBOARD_ROUTE, COURSES_ROUTE, APP_MONITOR_ROUTE);
	}

	if (userRole === "teacher") {
		routes.push(TEACHER_DASHBOARD_ROUTE, COURSES_ROUTE);
	}

	if (userRole === "student") {
		routes.push(STUDENT_DASHBOARD_ROUTE, COURSES_ROUTE);
	}

	if (userRole === "security") {
		routes.push(SECURITY_DASHBOARD_ROUTE);
	}

	if (userRole === "controller") {
		routes.push(
			CONTROLLER_DASHBOARD_ROUTE,
			COURSES_ROUTE,
			APP_MONITOR_ROUTE
		);
	}

	routes.push(MOBILE_ROUTE);

	return routes;
}

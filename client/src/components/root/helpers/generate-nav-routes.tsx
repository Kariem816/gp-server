import {
	BackpackIcon,
	HomeIcon,
	MixIcon,
	MixerVerticalIcon,
	MobileIcon,
} from "@radix-ui/react-icons";
import { UserRole } from "~/types/users";

type NavRoute = {
	name: string;
	path: string;
	Icon: JSX.Element;
};

const HOME_ROUTE: NavRoute = {
	name: "home",
	path: "/",
	Icon: <HomeIcon className="size-6 me-2" />,
};
const COURSES_ROUTE: NavRoute = {
	name: "courses",
	path: "/courses",
	Icon: <BackpackIcon className="size-6 me-2" />,
};
const APP_MONITOR_ROUTE: NavRoute = {
	name: "app_monitor",
	path: "/monitor",
	Icon: <MixIcon className="size-6 me-2" />,
};
const MOBILE_ROUTE: NavRoute = {
	name: "mobile",
	path: "/mobile",
	Icon: <MobileIcon className="size-6 me-2" />,
};
const ADMIN_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/admin",
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const STUDENT_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/students/me/",
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const TEACHER_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/teachers/me/",
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const SECURITY_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/security/me/",
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const CONTROLLER_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/controllers/me/",
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
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
		routes.push(CONTROLLER_DASHBOARD_ROUTE, APP_MONITOR_ROUTE);
	}

	routes.push(MOBILE_ROUTE);

	return routes;
}

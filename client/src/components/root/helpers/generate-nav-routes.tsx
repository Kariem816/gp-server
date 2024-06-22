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
	exact: boolean;
	Icon: JSX.Element;
};

const HOME_ROUTE: NavRoute = {
	name: "home",
	path: "/",
	exact: true,
	Icon: <HomeIcon className="size-6 me-2" />,
};
const COURSES_ROUTE: NavRoute = {
	name: "courses",
	path: "/courses",
	exact: false,
	Icon: <BackpackIcon className="size-6 me-2" />,
};
const APP_MONITOR_ROUTE: NavRoute = {
	name: "app_monitor",
	path: "/monitor",
	exact: false,
	Icon: <MixIcon className="size-6 me-2" />,
};
const MOBILE_ROUTE: NavRoute = {
	name: "mobile",
	path: "/mobile",
	exact: true,
	Icon: <MobileIcon className="size-6 me-2" />,
};
const ADMIN_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/admin",
	exact: false,
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const STUDENT_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/students/me/",
	exact: false,
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const TEACHER_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/teachers/me/",
	exact: false,
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const SECURITY_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/security/me/",
	exact: false,
	Icon: <MixerVerticalIcon className="size-6 me-2" />,
};
const CONTROLLER_DASHBOARD_ROUTE: NavRoute = {
	name: "dashboard",
	path: "/controllers/me/",
	exact: false,
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

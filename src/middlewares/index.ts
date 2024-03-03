import getUser from "./getUser";
import mustLogin, {
	isLoggedIn,
	mustBe,
	mustBeAdmin,
	mustBeStudent,
	mustBeAdminOrStudent,
	mustBeTeacher,
	mustBeAdminOrTeacher,
	mustBeController,
	mustBeAdminOrController,
	mustBeSecurity,
	mustBeAdminOrSecurity,
} from "./roles";
import { parseFilters } from "./filters";
import { getCourseProfile, mustBeCourseTeacher } from "./courses";
export { canModifyLecture } from "./lectures";
export { validateBody, validateQuery } from "./validate";
export { logger } from "./logger";

export {
	getUser,
	mustLogin,
	isLoggedIn,
	mustBe,
	mustBeAdmin,
	mustBeStudent,
	mustBeAdminOrStudent,
	mustBeTeacher,
	mustBeAdminOrTeacher,
	mustBeController,
	mustBeAdminOrController,
	mustBeSecurity,
	mustBeAdminOrSecurity,
	parseFilters,
	getCourseProfile,
	mustBeCourseTeacher,
};

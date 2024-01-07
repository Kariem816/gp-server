import getUser from "./getUser.js";
import mustLogin, {
	isLoggedIn,
	mustBeAdmin,
	mustBeStudent,
	mustBeAdminOrStudent,
	mustBeTeacher,
	mustBeAdminOrTeacher,
	mustBeController,
	mustBeAdminOrController,
	mustBeSecurity,
	mustBeAdminOrSecurity,
} from "./roles.js";
import { parseFilters } from "./filters.js";
import { getCourseProfile, mustBeCourseTeacher } from "./courses.js";
export { canModifyLecture } from "./lectures.js";
export { validateBody, validateQuery } from "./validate.js";
export { logger } from "./logger.js";

export {
	getUser,
	mustLogin,
	isLoggedIn,
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

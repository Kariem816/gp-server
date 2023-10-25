import getUser from "./getUser";
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
} from "./roles";

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
};

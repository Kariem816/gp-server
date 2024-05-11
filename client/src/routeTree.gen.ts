/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from "./pages/__root"
import { Route as MonitorRouteImport } from "./pages/monitor/route"
import { Route as AdminRouteImport } from "./pages/admin/route"
import { Route as IndexImport } from "./pages/index"
import { Route as RegisterIndexImport } from "./pages/register/index"
import { Route as PasswordResetIndexImport } from "./pages/password-reset/index"
import { Route as MonitorIndexImport } from "./pages/monitor/index"
import { Route as MobileIndexImport } from "./pages/mobile/index"
import { Route as LoginIndexImport } from "./pages/login/index"
import { Route as CoursesIndexImport } from "./pages/courses/index"
import { Route as AdminIndexImport } from "./pages/admin/index"
import { Route as TeachersIdImport } from "./pages/teachers/$id"
import { Route as StudentsIdImport } from "./pages/students/$id"
import { Route as ProfileMeImport } from "./pages/profile/me"
import { Route as ProfileIdImport } from "./pages/profile/$id"
import { Route as CoursesNewImport } from "./pages/courses/new"
import { Route as AdminUsersImport } from "./pages/admin/users"
import { Route as AdminParkingImport } from "./pages/admin/parking"
import { Route as AdminExtraImport } from "./pages/admin/extra"
import { Route as AdminControllersImport } from "./pages/admin/controllers"
import { Route as TeachersMeRouteImport } from "./pages/teachers/me/route"
import { Route as StudentsMeRouteImport } from "./pages/students/me/route"
import { Route as LecturesIdRouteImport } from "./pages/lectures/$id/route"
import { Route as ControllersMeRouteImport } from "./pages/controllers/me/route"
import { Route as TeachersMeIndexImport } from "./pages/teachers/me/index"
import { Route as StudentsMeIndexImport } from "./pages/students/me/index"
import { Route as SecurityMeIndexImport } from "./pages/security/me/index"
import { Route as MonitorSmartParkingIndexImport } from "./pages/monitor/smart-parking/index"
import { Route as MonitorParkingIndexImport } from "./pages/monitor/parking/index"
import { Route as MonitorLightingIndexImport } from "./pages/monitor/lighting/index"
import { Route as MonitorIrrigationIndexImport } from "./pages/monitor/irrigation/index"
import { Route as MonitorGarbageIndexImport } from "./pages/monitor/garbage/index"
import { Route as LecturesIdIndexImport } from "./pages/lectures/$id/index"
import { Route as CoursesIdIndexImport } from "./pages/courses/$id/index"
import { Route as ControllersMeIndexImport } from "./pages/controllers/me/index"
import { Route as TeachersMeScheduleImport } from "./pages/teachers/me/schedule"
import { Route as TeachersMeCoursesImport } from "./pages/teachers/me/courses"
import { Route as StudentsMeScheduleImport } from "./pages/students/me/schedule"
import { Route as StudentsMeCoursesImport } from "./pages/students/me/courses"
import { Route as StudentsMeAttendanceImport } from "./pages/students/me/attendance"
import { Route as LecturesIdImgsImport } from "./pages/lectures/$id/imgs"
import { Route as LecturesIdAttendanceImport } from "./pages/lectures/$id/attendance"
import { Route as CoursesIdTeachersImport } from "./pages/courses/$id/teachers"
import { Route as CoursesIdStudentsImport } from "./pages/courses/$id/students"
import { Route as CoursesIdLecturesImport } from "./pages/courses/$id/lectures"
import { Route as CoursesIdEditImport } from "./pages/courses/$id/edit"
import { Route as ControllersMeApiKeysImport } from "./pages/controllers/me/api-keys"

// Create/Update Routes

const MonitorRouteRoute = MonitorRouteImport.update({
  path: "/monitor",
  getParentRoute: () => rootRoute,
} as any)

const AdminRouteRoute = AdminRouteImport.update({
  path: "/admin",
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const RegisterIndexRoute = RegisterIndexImport.update({
  path: "/register/",
  getParentRoute: () => rootRoute,
} as any)

const PasswordResetIndexRoute = PasswordResetIndexImport.update({
  path: "/password-reset/",
  getParentRoute: () => rootRoute,
} as any)

const MonitorIndexRoute = MonitorIndexImport.update({
  path: "/",
  getParentRoute: () => MonitorRouteRoute,
} as any)

const MobileIndexRoute = MobileIndexImport.update({
  path: "/mobile/",
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  path: "/login/",
  getParentRoute: () => rootRoute,
} as any)

const CoursesIndexRoute = CoursesIndexImport.update({
  path: "/courses/",
  getParentRoute: () => rootRoute,
} as any)

const AdminIndexRoute = AdminIndexImport.update({
  path: "/",
  getParentRoute: () => AdminRouteRoute,
} as any)

const TeachersIdRoute = TeachersIdImport.update({
  path: "/teachers/$id",
  getParentRoute: () => rootRoute,
} as any)

const StudentsIdRoute = StudentsIdImport.update({
  path: "/students/$id",
  getParentRoute: () => rootRoute,
} as any)

const ProfileMeRoute = ProfileMeImport.update({
  path: "/profile/me",
  getParentRoute: () => rootRoute,
} as any)

const ProfileIdRoute = ProfileIdImport.update({
  path: "/profile/$id",
  getParentRoute: () => rootRoute,
} as any)

const CoursesNewRoute = CoursesNewImport.update({
  path: "/courses/new",
  getParentRoute: () => rootRoute,
} as any)

const AdminUsersRoute = AdminUsersImport.update({
  path: "/users",
  getParentRoute: () => AdminRouteRoute,
} as any)

const AdminParkingRoute = AdminParkingImport.update({
  path: "/parking",
  getParentRoute: () => AdminRouteRoute,
} as any)

const AdminExtraRoute = AdminExtraImport.update({
  path: "/extra",
  getParentRoute: () => AdminRouteRoute,
} as any)

const AdminControllersRoute = AdminControllersImport.update({
  path: "/controllers",
  getParentRoute: () => AdminRouteRoute,
} as any)

const TeachersMeRouteRoute = TeachersMeRouteImport.update({
  path: "/teachers/me",
  getParentRoute: () => rootRoute,
} as any)

const StudentsMeRouteRoute = StudentsMeRouteImport.update({
  path: "/students/me",
  getParentRoute: () => rootRoute,
} as any)

const LecturesIdRouteRoute = LecturesIdRouteImport.update({
  path: "/lectures/$id",
  getParentRoute: () => rootRoute,
} as any)

const ControllersMeRouteRoute = ControllersMeRouteImport.update({
  path: "/controllers/me",
  getParentRoute: () => rootRoute,
} as any)

const TeachersMeIndexRoute = TeachersMeIndexImport.update({
  path: "/",
  getParentRoute: () => TeachersMeRouteRoute,
} as any)

const StudentsMeIndexRoute = StudentsMeIndexImport.update({
  path: "/",
  getParentRoute: () => StudentsMeRouteRoute,
} as any)

const SecurityMeIndexRoute = SecurityMeIndexImport.update({
  path: "/security/me/",
  getParentRoute: () => rootRoute,
} as any)

const MonitorSmartParkingIndexRoute = MonitorSmartParkingIndexImport.update({
  path: "/smart-parking/",
  getParentRoute: () => MonitorRouteRoute,
} as any)

const MonitorParkingIndexRoute = MonitorParkingIndexImport.update({
  path: "/parking/",
  getParentRoute: () => MonitorRouteRoute,
} as any)

const MonitorLightingIndexRoute = MonitorLightingIndexImport.update({
  path: "/lighting/",
  getParentRoute: () => MonitorRouteRoute,
} as any)

const MonitorIrrigationIndexRoute = MonitorIrrigationIndexImport.update({
  path: "/irrigation/",
  getParentRoute: () => MonitorRouteRoute,
} as any)

const MonitorGarbageIndexRoute = MonitorGarbageIndexImport.update({
  path: "/garbage/",
  getParentRoute: () => MonitorRouteRoute,
} as any)

const LecturesIdIndexRoute = LecturesIdIndexImport.update({
  path: "/",
  getParentRoute: () => LecturesIdRouteRoute,
} as any)

const CoursesIdIndexRoute = CoursesIdIndexImport.update({
  path: "/courses/$id/",
  getParentRoute: () => rootRoute,
} as any)

const ControllersMeIndexRoute = ControllersMeIndexImport.update({
  path: "/",
  getParentRoute: () => ControllersMeRouteRoute,
} as any)

const TeachersMeScheduleRoute = TeachersMeScheduleImport.update({
  path: "/schedule",
  getParentRoute: () => TeachersMeRouteRoute,
} as any)

const TeachersMeCoursesRoute = TeachersMeCoursesImport.update({
  path: "/courses",
  getParentRoute: () => TeachersMeRouteRoute,
} as any)

const StudentsMeScheduleRoute = StudentsMeScheduleImport.update({
  path: "/schedule",
  getParentRoute: () => StudentsMeRouteRoute,
} as any)

const StudentsMeCoursesRoute = StudentsMeCoursesImport.update({
  path: "/courses",
  getParentRoute: () => StudentsMeRouteRoute,
} as any)

const StudentsMeAttendanceRoute = StudentsMeAttendanceImport.update({
  path: "/attendance",
  getParentRoute: () => StudentsMeRouteRoute,
} as any)

const LecturesIdImgsRoute = LecturesIdImgsImport.update({
  path: "/imgs",
  getParentRoute: () => LecturesIdRouteRoute,
} as any)

const LecturesIdAttendanceRoute = LecturesIdAttendanceImport.update({
  path: "/attendance",
  getParentRoute: () => LecturesIdRouteRoute,
} as any)

const CoursesIdTeachersRoute = CoursesIdTeachersImport.update({
  path: "/courses/$id/teachers",
  getParentRoute: () => rootRoute,
} as any)

const CoursesIdStudentsRoute = CoursesIdStudentsImport.update({
  path: "/courses/$id/students",
  getParentRoute: () => rootRoute,
} as any)

const CoursesIdLecturesRoute = CoursesIdLecturesImport.update({
  path: "/courses/$id/lectures",
  getParentRoute: () => rootRoute,
} as any)

const CoursesIdEditRoute = CoursesIdEditImport.update({
  path: "/courses/$id/edit",
  getParentRoute: () => rootRoute,
} as any)

const ControllersMeApiKeysRoute = ControllersMeApiKeysImport.update({
  path: "/api-keys",
  getParentRoute: () => ControllersMeRouteRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/admin": {
      preLoaderRoute: typeof AdminRouteImport
      parentRoute: typeof rootRoute
    }
    "/monitor": {
      preLoaderRoute: typeof MonitorRouteImport
      parentRoute: typeof rootRoute
    }
    "/controllers/me": {
      preLoaderRoute: typeof ControllersMeRouteImport
      parentRoute: typeof rootRoute
    }
    "/lectures/$id": {
      preLoaderRoute: typeof LecturesIdRouteImport
      parentRoute: typeof rootRoute
    }
    "/students/me": {
      preLoaderRoute: typeof StudentsMeRouteImport
      parentRoute: typeof rootRoute
    }
    "/teachers/me": {
      preLoaderRoute: typeof TeachersMeRouteImport
      parentRoute: typeof rootRoute
    }
    "/admin/controllers": {
      preLoaderRoute: typeof AdminControllersImport
      parentRoute: typeof AdminRouteImport
    }
    "/admin/extra": {
      preLoaderRoute: typeof AdminExtraImport
      parentRoute: typeof AdminRouteImport
    }
    "/admin/parking": {
      preLoaderRoute: typeof AdminParkingImport
      parentRoute: typeof AdminRouteImport
    }
    "/admin/users": {
      preLoaderRoute: typeof AdminUsersImport
      parentRoute: typeof AdminRouteImport
    }
    "/courses/new": {
      preLoaderRoute: typeof CoursesNewImport
      parentRoute: typeof rootRoute
    }
    "/profile/$id": {
      preLoaderRoute: typeof ProfileIdImport
      parentRoute: typeof rootRoute
    }
    "/profile/me": {
      preLoaderRoute: typeof ProfileMeImport
      parentRoute: typeof rootRoute
    }
    "/students/$id": {
      preLoaderRoute: typeof StudentsIdImport
      parentRoute: typeof rootRoute
    }
    "/teachers/$id": {
      preLoaderRoute: typeof TeachersIdImport
      parentRoute: typeof rootRoute
    }
    "/admin/": {
      preLoaderRoute: typeof AdminIndexImport
      parentRoute: typeof AdminRouteImport
    }
    "/courses/": {
      preLoaderRoute: typeof CoursesIndexImport
      parentRoute: typeof rootRoute
    }
    "/login/": {
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
    "/mobile/": {
      preLoaderRoute: typeof MobileIndexImport
      parentRoute: typeof rootRoute
    }
    "/monitor/": {
      preLoaderRoute: typeof MonitorIndexImport
      parentRoute: typeof MonitorRouteImport
    }
    "/password-reset/": {
      preLoaderRoute: typeof PasswordResetIndexImport
      parentRoute: typeof rootRoute
    }
    "/register/": {
      preLoaderRoute: typeof RegisterIndexImport
      parentRoute: typeof rootRoute
    }
    "/controllers/me/api-keys": {
      preLoaderRoute: typeof ControllersMeApiKeysImport
      parentRoute: typeof ControllersMeRouteImport
    }
    "/courses/$id/edit": {
      preLoaderRoute: typeof CoursesIdEditImport
      parentRoute: typeof rootRoute
    }
    "/courses/$id/lectures": {
      preLoaderRoute: typeof CoursesIdLecturesImport
      parentRoute: typeof rootRoute
    }
    "/courses/$id/students": {
      preLoaderRoute: typeof CoursesIdStudentsImport
      parentRoute: typeof rootRoute
    }
    "/courses/$id/teachers": {
      preLoaderRoute: typeof CoursesIdTeachersImport
      parentRoute: typeof rootRoute
    }
    "/lectures/$id/attendance": {
      preLoaderRoute: typeof LecturesIdAttendanceImport
      parentRoute: typeof LecturesIdRouteImport
    }
    "/lectures/$id/imgs": {
      preLoaderRoute: typeof LecturesIdImgsImport
      parentRoute: typeof LecturesIdRouteImport
    }
    "/students/me/attendance": {
      preLoaderRoute: typeof StudentsMeAttendanceImport
      parentRoute: typeof StudentsMeRouteImport
    }
    "/students/me/courses": {
      preLoaderRoute: typeof StudentsMeCoursesImport
      parentRoute: typeof StudentsMeRouteImport
    }
    "/students/me/schedule": {
      preLoaderRoute: typeof StudentsMeScheduleImport
      parentRoute: typeof StudentsMeRouteImport
    }
    "/teachers/me/courses": {
      preLoaderRoute: typeof TeachersMeCoursesImport
      parentRoute: typeof TeachersMeRouteImport
    }
    "/teachers/me/schedule": {
      preLoaderRoute: typeof TeachersMeScheduleImport
      parentRoute: typeof TeachersMeRouteImport
    }
    "/controllers/me/": {
      preLoaderRoute: typeof ControllersMeIndexImport
      parentRoute: typeof ControllersMeRouteImport
    }
    "/courses/$id/": {
      preLoaderRoute: typeof CoursesIdIndexImport
      parentRoute: typeof rootRoute
    }
    "/lectures/$id/": {
      preLoaderRoute: typeof LecturesIdIndexImport
      parentRoute: typeof LecturesIdRouteImport
    }
    "/monitor/garbage/": {
      preLoaderRoute: typeof MonitorGarbageIndexImport
      parentRoute: typeof MonitorRouteImport
    }
    "/monitor/irrigation/": {
      preLoaderRoute: typeof MonitorIrrigationIndexImport
      parentRoute: typeof MonitorRouteImport
    }
    "/monitor/lighting/": {
      preLoaderRoute: typeof MonitorLightingIndexImport
      parentRoute: typeof MonitorRouteImport
    }
    "/monitor/parking/": {
      preLoaderRoute: typeof MonitorParkingIndexImport
      parentRoute: typeof MonitorRouteImport
    }
    "/monitor/smart-parking/": {
      preLoaderRoute: typeof MonitorSmartParkingIndexImport
      parentRoute: typeof MonitorRouteImport
    }
    "/security/me/": {
      preLoaderRoute: typeof SecurityMeIndexImport
      parentRoute: typeof rootRoute
    }
    "/students/me/": {
      preLoaderRoute: typeof StudentsMeIndexImport
      parentRoute: typeof StudentsMeRouteImport
    }
    "/teachers/me/": {
      preLoaderRoute: typeof TeachersMeIndexImport
      parentRoute: typeof TeachersMeRouteImport
    }
  }
}

// Create and export the route tree

export const routeTree = rootRoute.addChildren([
  IndexRoute,
  AdminRouteRoute.addChildren([
    AdminControllersRoute,
    AdminExtraRoute,
    AdminParkingRoute,
    AdminUsersRoute,
    AdminIndexRoute,
  ]),
  MonitorRouteRoute.addChildren([
    MonitorIndexRoute,
    MonitorGarbageIndexRoute,
    MonitorIrrigationIndexRoute,
    MonitorLightingIndexRoute,
    MonitorParkingIndexRoute,
    MonitorSmartParkingIndexRoute,
  ]),
  ControllersMeRouteRoute.addChildren([
    ControllersMeApiKeysRoute,
    ControllersMeIndexRoute,
  ]),
  LecturesIdRouteRoute.addChildren([
    LecturesIdAttendanceRoute,
    LecturesIdImgsRoute,
    LecturesIdIndexRoute,
  ]),
  StudentsMeRouteRoute.addChildren([
    StudentsMeAttendanceRoute,
    StudentsMeCoursesRoute,
    StudentsMeScheduleRoute,
    StudentsMeIndexRoute,
  ]),
  TeachersMeRouteRoute.addChildren([
    TeachersMeCoursesRoute,
    TeachersMeScheduleRoute,
    TeachersMeIndexRoute,
  ]),
  CoursesNewRoute,
  ProfileIdRoute,
  ProfileMeRoute,
  StudentsIdRoute,
  TeachersIdRoute,
  CoursesIndexRoute,
  LoginIndexRoute,
  MobileIndexRoute,
  PasswordResetIndexRoute,
  RegisterIndexRoute,
  CoursesIdEditRoute,
  CoursesIdLecturesRoute,
  CoursesIdStudentsRoute,
  CoursesIdTeachersRoute,
  CoursesIdIndexRoute,
  SecurityMeIndexRoute,
])

/* prettier-ignore-end */

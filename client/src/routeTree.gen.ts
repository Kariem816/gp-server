import { Route as rootRoute } from "./pages/__root"
import { Route as IndexImport } from "./pages"
import { Route as LoginIndexImport } from "./pages/login"

const IndexRoute = IndexImport.update({
  path: "/",
  getParentRoute: () => rootRoute,
} as any)

const LoginIndexRoute = LoginIndexImport.update({
  path: "/login/",
  getParentRoute: () => rootRoute,
} as any)
declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    "/login/": {
      preLoaderRoute: typeof LoginIndexImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([IndexRoute, LoginIndexRoute])

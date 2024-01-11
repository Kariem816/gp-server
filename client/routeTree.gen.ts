import { Route as rootRoute } from './pages/__root'
import { Route as IndexImport } from './pages'
import { Route as TestIndexImport } from './pages/test'

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const TestIndexRoute = TestIndexImport.update({
  path: '/test/',
  getParentRoute: () => rootRoute,
} as any)
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/test/': {
      preLoaderRoute: typeof TestIndexImport
      parentRoute: typeof rootRoute
    }
  }
}
export const routeTree = rootRoute.addChildren([IndexRoute, TestIndexRoute])

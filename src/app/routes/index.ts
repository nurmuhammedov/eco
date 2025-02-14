export type { AppRoute } from './types';
export { default as AppRouter } from './AppRouter';
export { default as moduleRoutes } from './loader.ts';
export {
  filterRoutesByAuth,
  getHomeRoute,
  getHomeRouteForLoggedInUser,
} from './utils';

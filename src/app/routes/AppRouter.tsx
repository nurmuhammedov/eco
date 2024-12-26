import { lazy, Suspense } from 'react';
import { PrivateLayout, PublicLayout } from '@/layouts';
import { filterRoutesByAuth, getHomeRoute, moduleRoutes } from '@/app/routes';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { pick } from '@/shared/utils';
import { shallowEqual } from 'react-redux';
import { useAppSelector } from '@/store/hooks';

const Error = lazy(() => import('@/modules/error/pages'));

const AppRouter = () => {
  const { isAuthenticated, user } = useAppSelector(
    (state) => pick(state.auth, ['isAuthenticated', 'user']),
    shallowEqual,
  );
  const filteredRoutes = filterRoutesByAuth(
    moduleRoutes,
    user.roles,
    user.permissions,
    isAuthenticated,
  );

  const router = createBrowserRouter([
    {
      path: '/',
      index: true,
      element: <Navigate replace to={getHomeRoute()} />,
    },
    {
      path: '/auth',
      element: <Suspense fallback={null} children={<PublicLayout />} />,
      children: filteredRoutes.filter((route) => route.meta?.isPublic),
    },
    {
      path: '/app',
      element: <Suspense fallback="Loading..." children={<PrivateLayout />} />,
      children: filteredRoutes.filter((route) => route.meta?.restricted),
    },
    {
      path: '*',
      element: <Suspense fallback="Loading..." children={<PublicLayout />} />,
      children: [
        {
          path: '*',
          element: <Error />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;

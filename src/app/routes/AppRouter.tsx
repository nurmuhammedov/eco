import { lazy, Suspense } from 'react';
import { PrivateLayout, PublicLayout } from '@/layouts';
import { filterRoutesByAuth, getHomeRoute, moduleRoutes } from '@/app/routes';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';

const Error = lazy(() => import('@/modules/error/pages'));

const AppRouter = () => {
  const filteredRoutes = filterRoutesByAuth(moduleRoutes);

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
      element: <Suspense fallback={null} children={<PrivateLayout />} />,
      children: filteredRoutes.filter((route) => route.meta?.restricted),
    },
    {
      path: '*',
      element: <Suspense fallback={null} children={<PublicLayout />} />,
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

import { lazy } from 'react';
import Providers from '@/app/providers';
import { AuthLayout } from '@/shared/layouts';
import moduleRoutes from '@/app/routes/load-modules';
import { filterRoutesByAuth } from '@/app/routes/utils';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const Error = lazy(() => import('@/pages/error/ui/page-not-found'));

const AppRouter = () => {
  const filteredRoutes = filterRoutesByAuth(moduleRoutes);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Providers />,
      children: filteredRoutes.filter((route) => route.meta?.restricted),
    },
    {
      path: 'auth',
      element: <AuthLayout />,
      children: filteredRoutes.filter((route) => route.meta?.isPublic),
    },
    {
      path: '*',
      element: <Error />,
    },
  ]);

  return (
    <NuqsAdapter>
      <RouterProvider router={router} />
    </NuqsAdapter>
  );
};

export default AppRouter;

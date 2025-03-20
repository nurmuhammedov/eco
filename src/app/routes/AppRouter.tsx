import { lazy } from 'react';
import Providers from '@/app/providers';
import { PublicLayout } from '@/widgets';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import moduleRoutes from '@/app/routes/load-modules.ts';
import { filterRoutesByAuth } from '@/app/routes/utils.tsx';

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
      element: <PublicLayout />,
      children: filteredRoutes.filter((route) => route.meta?.isPublic),
    },
    // {
    //   path: '/app',
    //   element: <Suspense fallback={null} children={<PrivateLayout />} />,
    //   children: filteredRoutes.filter((route) => route.meta?.restricted),
    // },
    {
      path: '*',
      element: <Error />,
    },
  ]);

  return (
    <NuqsAdapter data-id={11}>
      <RouterProvider router={router} />
    </NuqsAdapter>
  );
};

export default AppRouter;

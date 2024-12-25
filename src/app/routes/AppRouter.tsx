import { useDynamicRoutes } from '@/app/routes';
import { PrivateLayout, PublicLayout } from '@/layouts';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const AppRouter = () => {
  const filteredRoutes = useDynamicRoutes();

  const router = createBrowserRouter([
    {
      path: '/',
      element: <PublicLayout />,
      children: filteredRoutes.filter((route) => route.meta?.isPublic),
    },
    {
      path: '/app',
      element: <PrivateLayout />,
      children: filteredRoutes.filter((route) => route.meta?.restricted),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRouter;

import { createBrowserRouter } from 'react-router-dom';
import { PrivateLayout, PublicLayout } from '../../layouts';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: '',
        element: 'Home',
      },
      {
        path: 'login',
        element: 'Login',
      },
    ],
  },
  {
    path: '/app',
    element: <PrivateLayout />,
    children: [
      {
        path: '',
        element: 'App',
      },
    ],
  },
]);

export default router;

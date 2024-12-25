import { createBrowserRouter } from 'react-router-dom';
import { PrivateLayout, PublicLayout } from '../../layouts';
import { Login } from '../../modules/auth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
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

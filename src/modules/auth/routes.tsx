import { lazy } from 'react';

const Login = lazy(() => import('@/modules/auth/pages/login'));

export default [
  {
    path: 'login',
    element: <Login />,
    meta: { isPublic: true },
  },
];

import { lazy } from 'react';

const Login = lazy(() => import('@/features/auth/login'));

export default [
  {
    path: 'login',
    element: <Login />,
    meta: { isPublic: true },
  },
];

import { lazy } from 'react';

const Login = lazy(() => import('@/pages/auth/ui/login-page'));

export default [
  {
    path: 'login',
    element: <Login />,
    meta: { isPublic: true },
  },
];

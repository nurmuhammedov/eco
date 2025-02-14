import { lazy } from 'react';

const LoginPage = lazy(() => import('@/pages/auth'));

export default [
  {
    path: 'login',
    element: <LoginPage />,
    meta: { isPublic: true },
  },
];

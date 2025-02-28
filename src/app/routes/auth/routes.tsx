import { lazy } from 'react';

const Login = lazy(() => import('@/pages/auth/ui/login-page'));
const AdminLogin = lazy(() => import('@/pages/auth/ui/admin-login'));

export default [
  {
    path: 'login',
    element: <Login />,
    meta: { isPublic: true },
  },
  {
    path: 'login/admin',
    element: <AdminLogin />,
    meta: { isPublic: true },
  },
];

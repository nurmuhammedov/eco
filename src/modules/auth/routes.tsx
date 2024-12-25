import { Login } from '@/modules/auth';

export default [
  {
    path: 'login',
    element: <Login />,
    meta: { isPublic: true },
  },
];

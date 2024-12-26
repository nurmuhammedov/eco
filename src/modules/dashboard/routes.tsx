// import { Dashboard } from '@/modules/dashboard';
import { UserRoles } from '@/shared/types';
import { lazy } from 'react';

const Dashboard = lazy(() => import('./pages/dashboard'));

export default [
  {
    path: '',
    element: <Dashboard />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
];

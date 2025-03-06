import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const DistrictPage = lazy(() => import('@/pages/admin/district/ui'));

export default [
  {
    path: 'admin/districts',
    element: <DistrictPage />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
];

import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const StaffsPage = lazy(() => import('@/pages/admin/staffs'));
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
  {
    path: 'admin/staffs',
    element: <StaffsPage />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
];

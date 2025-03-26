import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const StaffsPage = lazy(() => import('@/pages/admin/staffs'));
const RegionsPage = lazy(() => import('@/pages/admin/regions/ui'));

export default [
  {
    path: 'territories',
    element: <RegionsPage />,
    meta: { restricted: true, roles: [UserRoles.ADMIN] },
  },
  {
    path: 'staffs',
    element: <StaffsPage />,
    meta: { restricted: true, roles: [UserRoles.ADMIN] },
  },
];

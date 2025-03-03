import { lazy } from 'react';
import { UserRoles } from '@/shared/types';

const RegionsDictionary = lazy(
  () => import('@/widgets/admin/region/regions-dictionary-table.tsx'),
);

export default [
  {
    path: 'admin/regions',
    element: <RegionsDictionary />,
    meta: {
      restricted: true,
      roles: [UserRoles.ADMIN],
    },
  },
];

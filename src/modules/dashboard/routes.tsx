import { Dashboard } from '@/modules/dashboard';

export default [
  {
    path: '',
    element: <Dashboard />,
    meta: {
      restricted: true,
      roles: ['admin'],
    },
  },
];

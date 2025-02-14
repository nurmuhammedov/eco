import { lazy } from 'react';

const Application = lazy(() => import('@/features/user/applications/ui'));

export default () => {
  return <Application />;
};

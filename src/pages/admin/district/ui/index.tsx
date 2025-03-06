import { lazy } from 'react';

const DistrictWidget = lazy(() => import('@/widgets/admin/region/ui'));

export default function DistrictPage() {
  return <DistrictWidget />;
}

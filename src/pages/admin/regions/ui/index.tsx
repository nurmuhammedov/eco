import { lazy } from 'react';

const RegionsManagement = lazy(() => import('@/widgets/admin/regions-management/ui/regions-management'));

export default function RegionsPage() {
  return <RegionsManagement />;
}

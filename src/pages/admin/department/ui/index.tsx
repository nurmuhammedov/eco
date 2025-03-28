import { lazy } from 'react';

const DepartmentWidget = lazy(
  () => import('@/widgets/admin/department/ui/department'),
);

export default function DepartmentPage() {
  return <DepartmentWidget />;
}

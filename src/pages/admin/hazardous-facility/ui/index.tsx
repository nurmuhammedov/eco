import { lazy } from 'react';

const HazardousFacilityWidget = lazy(
  () => import('@/widgets/admin/hazardous-facility/ui/hazardous-facility'),
);

export default function HazardousFacilityPage() {
  return <HazardousFacilityWidget />;
}

import { useDistrictsPaged } from '@/entities/admin/district/api.ts';
import DistrictTable from '@/features/admin/region/ui/district-table.tsx';

export default function RegionsDictionaryTable() {
  const { data } = useDistrictsPaged(1, 10);

  return <DistrictTable />;
}

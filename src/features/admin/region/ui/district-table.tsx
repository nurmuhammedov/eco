import { Fragment } from 'react';
import { useDrawer } from '@/shared/hooks/use-drawer';
import { District } from '@/entities/admin/district/types';
import { useDistrictsPaged } from '@/entities/admin/district/api';
import { DataTable } from '@/shared/components/common/data-table';
import DistrictDrawer from '@/features/admin/region/ui/district-drawer';
import { districtTableColumns } from '@/features/admin/region/ui/district-columns';

export default function DistrictTable() {
  const { data } = useDistrictsPaged(1, 10);
  const {
    mode,
    isOpen,
    openDrawer,
    closeDrawer,
    data: selectedDistrict,
  } = useDrawer<District>();
  return (
    <Fragment>
      <DataTable
        namespace="ditricts"
        data={data?.content || []}
        pageCount={data?.totalPages}
        columns={districtTableColumns}
      />
      <DistrictDrawer
        mode={mode}
        isOpen={isOpen}
        onClose={closeDrawer}
        districtId={selectedDistrict?.id}
      />
    </Fragment>
  );
}

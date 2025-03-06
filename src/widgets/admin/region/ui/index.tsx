import { Fragment } from 'react';
import {
  DistrictDrawer,
  DistrictFilter,
  DistrictTable,
} from '@/features/admin/district';

export default function DistrictWidget() {
  return (
    <Fragment>
      <DistrictFilter />
      <DistrictTable />
      <DistrictDrawer />
    </Fragment>
  );
}

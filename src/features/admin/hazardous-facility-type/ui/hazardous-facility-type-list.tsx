import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { useHazardousFacilityTypeDrawer } from '@/shared/hooks/entity-hooks';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';
import {
  FilterHazardousFacilityTypeDTO,
  HazardousFacilityTypeTableItem,
  useDeleteHazardousFacilityType,
  useHazardousFacilityTypeListQuery,
} from '@/entities/admin/hazardous-facility-type';
import { objectToList } from '@/shared/constants/object-to-list';

export function HazardousFacilityTypeList() {
  const { filters } = useFilters();
  const { t } = useTranslation('common');
  const { onOpen } = useHazardousFacilityTypeDrawer();
  const { data, isLoading } = useHazardousFacilityTypeListQuery(
    filters as FilterHazardousFacilityTypeDTO,
  );
  const { sphereOptions } = objectToList();

  console.log(sphereOptions);
  const deleteData = useDeleteHazardousFacilityType();
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteData.mutate(id);

  const columns: ColumnDef<HazardousFacilityTypeTableItem>[] = [
    {
      maxSize: 20,
      accessorKey: 'number',
      header: t('sequence_number'),
      cell: (cell) => cell.row.index + 1,
    },
    {
      accessorKey: 'name',
      header: t('hazardous_facility_type'),
    },
    {
      accessorKey: 'description',
      header: t('hazardous_facility_type_description'),
    },
    {
      id: 'actions',
      maxSize: 40,
      enableResizing: false,
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          row={row}
          showDelete
          onEdit={(row) => onEdit(row.original.id!)}
          onDelete={(row) => onDelete(row.original.id!)}
        />
      ),
    },
  ];

  return (
    <DataTable
      isPaginated
      columns={columns}
      data={data || []}
      isLoading={isLoading}
      className="h-[calc(100svh-270px)]"
    />
  );
}

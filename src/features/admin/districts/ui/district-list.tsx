import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters/use-filters.ts';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';
import {
  District,
  FilterDistrictDTO,
  useDeleteDistrict,
  useDistrictsQuery,
} from '@/entities/admin/districts';

export function DistrictList() {
  const { filters } = useFilters();
  const { onOpen } = useDistrictDrawer();
  const { t } = useTranslation('common');
  const deleteRegion = useDeleteDistrict();
  const { data, isLoading } = useDistrictsQuery(filters as FilterDistrictDTO);
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteRegion.mutate(id);

  const districtTableColumns: ColumnDef<District>[] = [
    {
      maxSize: 20,
      accessorKey: 'number',
      header: t('sequence_number'),
      cell: (cell) => cell.row.index + 1,
    },
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      header: t('name'),
    },
    {
      enablePinning: true,
      accessorKey: 'region',
      enableSorting: false,
      header: t('region'),
    },
    {
      accessorKey: 'soato',
      header: t('district_code'),
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
      data={data || []}
      namespace="region"
      isLoading={isLoading}
      columns={districtTableColumns}
      className="h-[calc(100svh-270px)]"
    />
  );
}

import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { type FilterRegionDTO, type Region, useDeleteRegion, useRegionsQuery } from '@/entities/admin/region';

export function RegionList() {
  const { filters } = useFilters();
  const { onOpen } = useRegionDrawer();
  const { t } = useTranslation('common');
  const { data, isLoading } = useRegionsQuery(filters as FilterRegionDTO);
  const deleteRegion = useDeleteRegion();
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteRegion.mutate(id);

  const regionTableColumns: ColumnDef<Region>[] = [
    {
      // enablePinning: true,
      accessorKey: 'name',
      // enableSorting: false,
      header: t('name'),
      maxSize: -10,
    },
    {
      accessorKey: 'soato',
      header: t('region_code'),
      maxSize: -10,
    },
    {
      id: 'actions',
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
      isLoading={isLoading}
      columns={regionTableColumns}
      className="h-[calc(100svh-270px)]"
    />
  );
}

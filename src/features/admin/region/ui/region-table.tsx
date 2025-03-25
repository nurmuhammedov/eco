import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { useDeleteRegion, useRegionsQuery } from '@/entities/admin/region';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import type { Region } from '@/entities/admin/region/region.types';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';

export function RegionTable() {
  const { filters } = useFilters();
  const { t } = useTranslation('common');
  const { onOpen } = useRegionDrawer();
  const { data } = useRegionsQuery(filters);
  const deleteRegion = useDeleteRegion();

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = async (id: number) => {
    await deleteRegion.mutateAsync(id);
  };

  const regionTableColumns: ColumnDef<Region>[] = [
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
      accessorKey: 'soato',
      header: t('region_code'),
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
          onEdit={(row) => onEdit(row.original.id)}
          onDelete={(row) => onDelete(row.original.id)}
        />
      ),
    },
  ];

  return (
    <DataTable
      namespace="region"
      data={data?.content || []}
      pageCount={data?.totalPages}
      columns={regionTableColumns}
      className="h-[calc(100svh-270px)]"
    />
  );
}

import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { useRegionsQuery } from '@/entities/admin/region';
import { useRegionDrawer } from '@/shared/hooks/entity-hooks';
import type { Region } from '@/entities/admin/region/region.types';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';

export function RegionTable() {
  const { t } = useTranslation('common');
  const { filters } = useFilters();
  const { onOpen } = useRegionDrawer();
  const { data } = useRegionsQuery(filters);

  const onEdit = (id: number) => {
    onOpen(UIModeEnum.EDIT, { id });
  };

  const regionTableColumns: ColumnDef<Region>[] = [
    {
      maxSize: 20,
      header: '№',
      accessorKey: 'number',
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
          showView
          row={row}
          showDelete
          onEdit={(row) => onEdit(row.original.id)}
          onView={(row) => console.log(row.original.id)}
          onDelete={(row) => console.log(row.original.id)}
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
      className="h-[calc(100svh-15.5rem)]"
    />
  );
}

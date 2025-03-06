import { PencilLine, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { useFilters } from '@/shared/hooks/use-filters';
import { District } from '@/entities/admin/district/types';
import { useDistrictsPaged } from '@/entities/admin/district/api';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
} from '@/shared/components/common/data-table';

export function DistrictTable() {
  const { filters } = useFilters();
  const { data } = useDistrictsPaged(filters);

  const districtTableColumns: ColumnDef<District>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nomi" />
      ),
      cell: ({ row }) => <div className="w-72">{row.getValue('id')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Viloyat" />
      ),
      cell: ({ row }) => {
        return (
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: 'Edit',
              icon: <PencilLine />,
              onClick: () => console.log('Edit clicked'),
            },
            {
              label: 'Delete',
              icon: <Trash />,
              onClick: () => console.log('Delete clicked'),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <DataTable
      namespace="districts"
      data={data?.content || []}
      pageCount={data?.totalPages}
      columns={districtTableColumns}
    />
  );
}

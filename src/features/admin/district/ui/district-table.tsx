import { PencilLine, Trash2 } from 'lucide-react';
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
  const list: District[] = [
    {
      id: 1,
      name: 'Mirobod tumani',
      region: {
        id: 1,
        name: 'Toshkent shahri',
      },
    },
    {
      id: 2,
      name: 'Chilonzor tumani',
      region: {
        id: 1,
        name: 'Toshkent shahri',
      },
    },
  ];

  const districtTableColumns: ColumnDef<District>[] = [
    {
      accessorKey: 'id',
      enableResizing: true,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nomi" />
      ),
      size: 10,
      enableSorting: false,
      enableHiding: false,
    },
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nomi" />
      ),
    },
    {
      enableSorting: false,
      accessorKey: 'region.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Viloyat" />
      ),
      cell: ({ row }) => row.original.region.name,
    },
    {
      id: 'actions',
      size: 10,
      meta: {
        isFixed: true,
      },
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={[
            {
              label: 'Tahrirlash',
              icon: <PencilLine className="size-4" />,
              onClick: () => console.log('Edit clicked'),
            },
            {
              label: "O'chirish",
              icon: <Trash2 className="size-4 hover:text-red-500" />,
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
      data={list || []}
      pageCount={data?.totalPages}
      columns={districtTableColumns}
      className="h-[calc(100svh-14.5rem)]"
    />
  );
}

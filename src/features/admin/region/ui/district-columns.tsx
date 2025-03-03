import { PencilLine, Trash } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { District } from '@/entities/admin/district/types';
import {
  DataTableColumnHeader,
  DataTableRowActions,
} from '@/shared/components/common/data-table';

export const districtTableColumns: ColumnDef<District>[] = [
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
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue('title')}
          </span>
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
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
        row={row}
      />
    ),
  },
];

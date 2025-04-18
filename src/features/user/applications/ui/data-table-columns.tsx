import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/shared/components/ui/badge';

import { Task } from '../models/application.model';
import { labels, priorities, statuses } from '../data/data';
import { DataTableColumnHeader, DataTableRowActions } from '@/shared/components/common/data-table';

export const dataTableColumns: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Юқори турувчи ташкилотнинг номи" />,
    cell: ({ row }) => <div className="w-72">{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="ХИЧОдан фойдаланувчи ташкилот номи" />,
    cell: ({ row }) => {
      const label = labels.find((label) => label.value === row.original.label);

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    enableSorting: false,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = statuses.find((status) => status.value === row.getValue('status'));

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-28 items-center">
          {status.icon && <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    enableSorting: false,
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Priority" />,
    cell: ({ row }) => {
      const priority = priorities.find((priority) => priority.value === row.getValue('priority'));

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions
        showEdit
        showView
        row={row}
        showDelete
        onEdit={(row) => console.log(row.original.id)}
        onView={(row) => console.log(row.original.id)}
        onDelete={(row) => console.log(row.original.id)}
      />
    ),
  },
];

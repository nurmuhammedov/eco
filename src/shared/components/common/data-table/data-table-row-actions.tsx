import { Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu.tsx';
import { ReactNode } from 'react';

interface Action<TData> {
  label: string;
  icon?: ReactNode;
  className?: string;
  onClick: (row: Row<TData>) => void;
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions: Action<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions,
}: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {actions?.length
          ? actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                className={action.className}
                onClick={() => action.onClick(row)}
              >
                {action.icon ? action.icon : null} {action.label}
              </DropdownMenuItem>
            ))
          : 'No Result'}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

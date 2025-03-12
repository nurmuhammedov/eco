import { ReactNode } from 'react';
import { cn } from '@/shared/lib/utils';
import { Row } from '@tanstack/react-table';

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
  return actions?.length
    ? actions.map((action, index) => (
        <button
          key={index}
          className={cn(
            'p-1 flex items-center justify-center rounded hover:bg-gray-300',
            action.className,
          )}
          onClick={() => action.onClick(row)}
        >
          <span className="size-5 flex items-center justify-center">
            {action.icon ? action.icon : null}
          </span>
        </button>
      ))
    : 'No Result';
}

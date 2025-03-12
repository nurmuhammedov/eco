import { cn } from '@/shared/lib/utils';
import { Row } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React, { memo, ReactNode, useCallback } from 'react';

interface ActionButtonConfig {
  icon: ReactNode;
  className?: string;
  onClick: () => void;
  ariaLabel: string;
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>;

  showEdit?: boolean;
  showView?: boolean;
  showDelete?: boolean;

  onEdit?: (row: Row<TData>) => void;
  onView?: (row: Row<TData>) => void;
  onDelete?: (row: Row<TData>) => void;

  editClassName?: string;
  viewClassName?: string;
  deleteClassName?: string;

  containerClassName?: string;
}

const ActionButton = memo(
  ({ icon, className, onClick, ariaLabel }: ActionButtonConfig) => {
    return (
      <button
        type="button"
        aria-label={ariaLabel}
        className={cn(
          'p-1 flex items-center justify-center rounded transition-colors',
          'focus:outline-none hover:bg-neutral-250',
          className,
        )}
        onClick={onClick}
      >
        <span className="size-5 flex items-center justify-center">{icon}</span>
      </button>
    );
  },
);

ActionButton.displayName = 'ActionButton';

function DataTableRowActions<TData>({
  row,
  showEdit = true,
  showDelete = true,
  showView = true,
  onEdit,
  onDelete,
  onView,
  editClassName,
  deleteClassName,
  viewClassName,
  containerClassName,
}: DataTableRowActionsProps<TData>): React.ReactElement | null {
  // Memoize handlers with proper typing
  const handleEdit = useCallback((): void => {
    if (onEdit) onEdit(row);
  }, [onEdit, row]);

  const handleDelete = useCallback((): void => {
    if (onDelete) onDelete(row);
  }, [onDelete, row]);

  const handleView = useCallback((): void => {
    if (onView) onView(row);
  }, [onView, row]);

  const buttons: ActionButtonConfig[] = [
    ...(showView && onView
      ? [
          {
            ariaLabel: 'View',
            onClick: handleView,
            className: cn(viewClassName),
            icon: <Eye className="size-4" />,
          },
        ]
      : []),
    ...(showEdit && onEdit
      ? [
          {
            ariaLabel: 'Edit',
            onClick: handleEdit,
            className: cn(editClassName),
            icon: <Pencil className="size-4" />,
          },
        ]
      : []),
    ...(showDelete && onDelete
      ? [
          {
            ariaLabel: 'Delete',
            onClick: handleDelete,
            className: cn(deleteClassName),
            icon: <Trash2 className="size-4" />,
          },
        ]
      : []),
  ];

  if (buttons.length === 0) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label="Row actions"
      className={cn('flex gap-1', containerClassName)}
    >
      {buttons.map((button, index) => (
        <ActionButton
          key={index}
          icon={button.icon}
          onClick={button.onClick}
          className={button.className}
          ariaLabel={button.ariaLabel}
        />
      ))}
    </div>
  );
}

DataTableRowActions.displayName = 'DataTableRowActions';

export { DataTableRowActions };

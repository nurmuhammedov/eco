import { cn } from '@/shared/lib/utils';
import { Row } from '@tanstack/react-table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import React, { memo, ReactNode, useCallback } from 'react';
import DeleteConfirmationDialog from '../delete-confirm-dialog';

interface ActionButtonConfig {
  icon: ReactNode;
  className?: string;
  onClick: () => void;
  ariaLabel: string;
  isDelete?: boolean;
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
  ({
    icon,
    className,
    onClick,
    ariaLabel,
    isDelete = false,
  }: ActionButtonConfig) => {
    // For delete button, wrap with confirmation dialog
    if (isDelete) {
      return <DeleteConfirmationDialog onConfirm={onClick} />;
    }

    // For non-delete buttons, render normally
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

  // Make sure onDelete handler returns a Promise
  const handleDelete = useCallback(async (): Promise<void> => {
    if (onDelete) {
      // Convert the result to a Promise if it's not already
      await Promise.resolve(onDelete(row));
    }
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
            isDelete: true,
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
          isDelete={button.isDelete}
        />
      ))}
    </div>
  );
}

DataTableRowActions.displayName = 'DataTableRowActions';

export { DataTableRowActions };

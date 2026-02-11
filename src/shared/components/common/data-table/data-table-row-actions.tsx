import { cn } from '@/shared/lib/utils'
import { Row } from '@tanstack/react-table'
import { Eye, Pencil, Trash2, QrCode } from 'lucide-react'
import React, { memo, ReactNode, useCallback } from 'react'
import DeleteConfirmationDialog from '../delete-confirm-dialog'

interface ActionButtonConfig {
  icon: ReactNode
  className?: string
  onClick: () => void
  ariaLabel: string
  isDelete?: boolean
}

export interface DataTableRowActionsProps<TData> {
  row: Row<TData>

  showEdit?: boolean
  showQr?: boolean
  showView?: boolean
  showDelete?: boolean

  onEdit?: (row: Row<TData>) => void
  onQr?: (row: Row<TData>) => void
  onView?: (row: Row<TData>) => void
  onDelete?: (row: Row<TData>) => void

  editClassName?: string
  qrClassName?: string
  viewClassName?: string
  deleteClassName?: string

  containerClassName?: string
}

const ActionButton = memo(({ icon, className, onClick, ariaLabel, isDelete = false }: ActionButtonConfig) => {
  if (isDelete) {
    return <DeleteConfirmationDialog onConfirm={onClick} />
  }

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'flex items-center justify-center rounded p-1 transition-colors',
        'hover:bg-neutral-250 focus:outline-none',
        className
      )}
      onClick={onClick}
    >
      <span className="flex size-5 items-center justify-center">{icon}</span>
    </button>
  )
})

ActionButton.displayName = 'ActionButton'

function DataTableRowActions<TData>({
  row,
  showEdit = true,
  showQr = true,
  showDelete = true,
  showView = true,
  onEdit,
  onQr,
  onDelete,
  onView,
  editClassName,
  qrClassName,
  deleteClassName,
  viewClassName,
  containerClassName,
}: DataTableRowActionsProps<TData>): React.ReactElement | null {
  const handleEdit = useCallback((): void => {
    if (onEdit) onEdit(row)
  }, [onEdit, row])

  const handleDelete = useCallback((): void => {
    if (onDelete) {
      onDelete(row)
    }
  }, [onDelete, row])

  const handleView = useCallback((): void => {
    if (onView) onView(row)
  }, [onView, row])

  const handleQr = useCallback((): void => {
    if (onQr) onQr(row)
  }, [onQr, row])

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
    ...(showQr && onQr
      ? [
          {
            ariaLabel: 'Qr',
            onClick: handleQr,
            className: cn(qrClassName),
            icon: <QrCode className="size-4" />,
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
  ]

  if (buttons.length === 0) {
    return null
  }

  return (
    <div role="group" aria-label="Row actions" className={cn('flex gap-1', containerClassName)}>
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
  )
}

DataTableRowActions.displayName = 'DataTableRowActions'

export { DataTableRowActions }

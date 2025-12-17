import { Column } from '@tanstack/react-table'
import { CSSProperties } from 'react'

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  withBorder?: boolean
  header?: boolean
}): CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left')
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right')

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px hsl(var(--border)) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px hsl(var(--border)) inset'
          : undefined
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'bg-neutral-50',
    width: `${column.getSize()}px`,
    minWidth: column.columnDef.minSize ? `${column.columnDef.minSize}px` : undefined,
    maxWidth: column.columnDef.maxSize ? `${column.columnDef.maxSize}px` : undefined,
    zIndex: isPinned ? 10 : 0,
  }
}

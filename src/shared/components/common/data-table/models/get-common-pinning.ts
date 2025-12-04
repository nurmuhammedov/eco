import React from 'react'
import { Column } from '@tanstack/react-table'

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  withBorder?: boolean
}): React.CSSProperties {
  const columnSize = column.getSize()
  const columnMinSize = column.columnDef.minSize
  const columnMaxSize = column.columnDef.maxSize

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
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? 'hsl(var(--background))' : 'bg-neutral-50',
    width: `${columnSize}px`, // Explicit width with px
    minWidth: columnMinSize ? `${columnMinSize}px` : undefined,
    maxWidth: columnMaxSize ? `${columnMaxSize}px` : undefined,
    zIndex: isPinned ? 1 : 0,
  }
}

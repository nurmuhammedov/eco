import { TableCell, TableRow } from '@/shared/components/ui/table'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { ColumnDef } from '@tanstack/react-table'

/** Large page sizes would push the skeleton far past the viewport, so cap what we draw. */
const MAX_SKELETON_ROWS = 10

interface DataTableLoadingProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  rowCount?: number
  showNumeration?: boolean
  isLoading?: boolean
}

export function DataTableLoading<TData, TValue>({
  columns,
  rowCount = MAX_SKELETON_ROWS,
  showNumeration = true,
  isLoading = false,
}: DataTableLoadingProps<TData, TValue>) {
  const rows = Math.min(Math.max(rowCount, 1), MAX_SKELETON_ROWS)

  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent" disableZebra={isLoading}>
          {showNumeration && (
            <TableCell className="w-[50px] p-2">
              <Skeleton className="h-5 w-full rounded" />
            </TableCell>
          )}
          {columns.map((column, columnIndex) => (
            <TableCell key={columnIndex} className="p-2" style={{ width: column.size }}>
              <Skeleton className="h-5 w-full rounded" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

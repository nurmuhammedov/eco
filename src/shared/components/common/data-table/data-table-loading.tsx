import { TableCell, TableRow } from '@/shared/components/ui/table'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { ColumnDef } from '@tanstack/react-table'

interface DataTableLoadingProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  rowCount?: number
  showNumeration?: boolean
  isLoading?: boolean
}

export function DataTableLoading<TData, TValue>({
  columns,
  rowCount = 20,
  showNumeration = true,
  isLoading = false,
}: DataTableLoadingProps<TData, TValue>) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <TableRow key={i} className="hover:bg-transparent" disableZebra={isLoading}>
          {showNumeration && (
            <TableCell className="w-[50px] p-2">
              <Skeleton className="h-6 w-full rounded-md" />
            </TableCell>
          )}
          {columns.map((column, j) => (
            <TableCell key={j} className="p-2" style={{ width: column.size }}>
              <Skeleton className="h-9 w-full rounded-md" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

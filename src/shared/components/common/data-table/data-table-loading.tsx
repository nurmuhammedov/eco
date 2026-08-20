import { TableCell, TableRow } from '@/shared/components/ui/table'
import { ColumnDef } from '@tanstack/react-table'

interface DataTableLoadingProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  showNumeration?: boolean
}

export function DataTableLoading<TData, TValue>({
  columns,
  showNumeration = true,
}: DataTableLoadingProps<TData, TValue>) {
  return (
    <TableRow className="hover:bg-transparent" disableZebra>
      <TableCell colSpan={columns.length + (showNumeration ? 1 : 0)} className="p-0">
        <div className="flex h-80 w-full flex-col items-center justify-center gap-4" role="status" aria-live="polite">
          <span className="relative flex size-14 items-center justify-center">
            <span className="bg-teal/10 absolute inset-0 rounded-full" />
            <span className="border-teal/20 border-t-teal absolute inset-0 animate-spin rounded-full border-[3px]" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="text-teal relative size-6"
            >
              <ellipse cx="12" cy="5" rx="8" ry="3" />
              <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
              <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
            </svg>
          </span>
          <p className="text-muted-foreground text-sm font-medium">Ma’lumotlar yuklanmoqda…</p>
        </div>
      </TableCell>
    </TableRow>
  )
}

import { TableCell, TableRow } from '@/shared/components/ui/table'

interface DataTableLoadingProps {
  /** Must be the rendered leaf column count; grouped headers make the definition count too small. */
  colSpan: number
}

export function DataTableLoading({ colSpan }: DataTableLoadingProps) {
  return (
    <TableRow className="hover:bg-transparent" disableZebra>
      <TableCell colSpan={colSpan} className="p-0">
        <div className="flex h-80 w-full flex-col items-center justify-center gap-4" role="status" aria-live="polite">
          <span className="relative flex size-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-blue-500/10" />
            <span className="absolute inset-0 animate-spin rounded-full border-[3px] border-blue-500/20 border-t-blue-500" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="relative size-6 text-blue-500"
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

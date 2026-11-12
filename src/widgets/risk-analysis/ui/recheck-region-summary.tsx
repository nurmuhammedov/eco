import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { useData } from '@/shared/hooks/api'
import { cn } from '@/shared/lib/utils'

/** RecheckHighCountByRegion (`GET /risk-analyses/recheck/count/by-region`) */
interface RecheckHighCountByRegion {
  region: string
  regionId: number
  total: number
  inspectionCreated: number
  inactivatedBetween: number
  invalidatedBetween: number
  invalidatedBefore: number
  stateOwned: number
}

type CountKey = Exclude<keyof RecheckHighCountByRegion, 'region' | 'regionId'>

const COLUMNS: { key: CountKey; title: string }[] = [
  { key: 'total', title: 'Jami (yuqori)' },
  { key: 'inspectionCreated', title: 'Tekshiruv yaratilgan' },
  { key: 'inactivatedBetween', title: 'Ro‘yxatdan chiqarilgan' },
  { key: 'invalidatedBetween', title: 'Vaqtincha nofaolga o‘tkazilgan' },
  { key: 'invalidatedBefore', title: 'Tahlilgacha nofaol bo‘lgan' },
  { key: 'stateOwned', title: 'Davlat tashkiloti' },
]

const zero = (regionId: number, region: string): RecheckHighCountByRegion => ({
  region,
  regionId,
  total: 0,
  inspectionCreated: 0,
  inactivatedBetween: 0,
  invalidatedBetween: 0,
  invalidatedBefore: 0,
  stateOwned: 0,
})

interface Props {
  year: string
  quarter: string
  regions: { id: number; name: string | null }[]
  /** Opens the list for a region, or for all of them on the total row */
  onRegionSelect: (regionId: number | null) => void
  className?: string
}

/**
 * What became of the XICHOs that came out HIGH again on the recheck, region by
 * region. The backend leaves out regions with none, so every region is listed
 * here with zeros, and the total row is summed on this side.
 *
 * Its rows also open the list narrowed to a region: a region with nothing to
 * list is not offered.
 */
export const RecheckRegionSummary = ({ year, quarter, regions, onRegionSelect, className }: Props) => {
  const { data = [], isLoading } = useData<RecheckHighCountByRegion[]>('/risk-analyses/recheck/count/by-region', true, {
    year,
    quarter,
  })

  const rows = useMemo(() => {
    const byRegion = new Map(data.map((row) => [row.regionId, row]))
    const listed = regions.map((region) => byRegion.get(region.id) ?? zero(region.id, region.name ?? ''))
    // A region the dictionary does not know still counts
    const extra = data.filter((row) => !regions.some((region) => region.id === row.regionId))
    return [...listed, ...extra]
  }, [data, regions])

  const totals = useMemo(
    () =>
      COLUMNS.reduce(
        (acc, { key }) => ({ ...acc, [key]: rows.reduce((sum, row) => sum + (row[key] ?? 0), 0) }),
        {} as Record<CountKey, number>
      ),
    [rows]
  )

  return (
    // Fills what the cards leave, the way the list's table does, and scrolls inside
    <div className={cn('relative flex-1 overflow-auto rounded-md bg-white', className)}>
      {isLoading ? (
        <Skeleton className="m-3 h-40" />
      ) : (
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-12">T/r</TableHead>
              <TableHead>Viloyat</TableHead>
              {COLUMNS.map((column) => (
                <TableHead key={column.key} className="text-center">
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          {/* The last region sits flat on the total row, as that one does on it */}
          <TableBody className="[&>tr:last-child>td:first-child]:rounded-bl-none [&>tr:last-child>td:last-child]:rounded-br-none">
            {rows.map((row, index) => (
              <TableRow
                key={row.regionId}
                className={cn(row.total > 0 && 'hover:bg-teal/5 cursor-pointer')}
                onClick={row.total > 0 ? () => onRegionSelect(row.regionId) : undefined}
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">
                  {row.total > 0 ? (
                    // The row takes the click; the button is there for the keyboard
                    <button type="button" className="text-teal text-left hover:underline">
                      {row.region}
                    </button>
                  ) : (
                    row.region
                  )}
                </TableCell>
                {COLUMNS.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      'text-center',
                      column.key === 'total' && 'font-semibold',
                      !row[column.key] && 'text-gray-400'
                    )}
                  >
                    {row[column.key] ?? 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
          {/* Kept in view while the regions scroll under it */}
          <TableFooter className="sticky bottom-0 z-10 bg-neutral-100 font-semibold">
            <TableRow
              disableZebra
              className={cn(
                // Cells round every corner by default; this row sits flat against the rows above
                '[&>td:first-child]:rounded-tl-none [&>td:last-child]:rounded-tr-none',
                totals.total > 0 && 'cursor-pointer hover:bg-neutral-200/60'
              )}
              onClick={totals.total > 0 ? () => onRegionSelect(null) : undefined}
            >
              <TableCell />
              <TableCell>
                {totals.total > 0 ? (
                  <button type="button" className="text-teal text-left hover:underline">
                    Jami
                  </button>
                ) : (
                  'Jami'
                )}
              </TableCell>
              {COLUMNS.map((column) => (
                <TableCell key={column.key} className="text-center">
                  {totals[column.key]}
                </TableCell>
              ))}
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  )
}

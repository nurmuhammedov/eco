import { useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table'
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
  month: string
  regions: { id: number; name: string | null }[]
}

/**
 * What became of the XICHOs that came out HIGH again on the recheck, region by
 * region. The backend leaves out regions with none, so every region is listed
 * here with zeros, and the total row is summed on this side.
 */
export const RecheckRegionSummary = ({ year, month, regions }: Props) => {
  const { data = [], isLoading } = useData<RecheckHighCountByRegion[]>('/risk-analyses/recheck/count/by-region', true, {
    year,
    month,
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
    <div className="mb-3 rounded-lg border bg-white">
      <div className="border-b px-4 py-2.5">
        <h6 className="text-sm font-semibold text-gray-800">
          Qayta tahlilda yana yuqori bo‘lgan XICHOlar (viloyatlar kesimida)
        </h6>
        <p className="text-xs text-gray-500">
          Har bir viloyat bo‘yicha: jami = tekshiruv yaratilgan + ro‘yxatdan chiqarilgan + vaqtincha nofaol +
          tahlilgacha nofaol + davlat tashkiloti
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="m-4 h-40" />
      ) : (
        <Table>
          <TableHeader>
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
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={row.regionId}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="font-medium">{row.region}</TableCell>
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
            <TableRow className="bg-gray-50 font-semibold">
              <TableCell />
              <TableCell>Jami</TableCell>
              {COLUMNS.map((column) => (
                <TableCell key={column.key} className="text-center">
                  {totals[column.key]}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  )
}

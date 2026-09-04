import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { GoBack } from '@/shared/components/common'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useData } from '@/shared/hooks'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useRegionSelectQuery } from '@/entities/admin/districts'
import { cn } from '@/shared/lib/utils'
import { IrsXrayStatusItem } from './types'

const ALL = 'ALL'

/**
 * The backend returns the country total as one more row, labelled in prose
 * rather than flagged. Matching the wording is what the neighbouring reports
 * already do, so the same phrasings are accepted here.
 */
const isSummaryRow = (regionName?: string) => {
  const name = regionName?.toLowerCase() ?? ''

  return name.includes('bo‘yicha') || name.includes("bo'yicha") || name === 'jami'
}

interface Row {
  regionName: string
  isSummary: boolean
  irsAll: number
  irsActive: number
  irsInactive: number
  xrayAll: number
  xrayValid: number
  xrayExpired: number
  xrayNoDate: number
  xrayInactive: number
}

const Count = ({ row, value, tone }: { row: Row; value: number; tone?: string }) => (
  <span className={cn('tabular-nums', tone, row.isSummary && 'font-bold')}>{value}</span>
)

const IrsXrayStatusReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const regionParam = paramsObject.regionId || ALL

  const { data: regions } = useRegionSelectQuery()

  const { data, isLoading } = useData<IrsXrayStatusItem[]>(
    '/reports/registry/irs-xray/status',
    true,
    regionParam !== ALL ? { regionId: regionParam } : undefined
  )

  const tableData = useMemo<Row[]>(() => {
    if (!Array.isArray(data)) return []

    const rows = data.map((item) => ({
      regionName: item.regionName,
      isSummary: isSummaryRow(item.regionName),
      irsAll: item.irs?.allCount ?? 0,
      irsActive: item.irs?.activeCount ?? 0,
      irsInactive: item.irs?.inactiveCount ?? 0,
      xrayAll: item.xray?.allCount ?? 0,
      xrayValid: item.xray?.validCount ?? 0,
      xrayExpired: item.xray?.expiredCount ?? 0,
      xrayNoDate: item.xray?.noDateCount ?? 0,
      xrayInactive: item.xray?.inactiveCount ?? 0,
    }))

    // The total belongs at the top, where it is read first, wherever the
    // backend happened to place it.
    return [...rows.filter((row) => row.isSummary), ...rows.filter((row) => !row.isSummary)]
  }, [data])

  const columns = useMemo(
    () => [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 220,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
        cell: ({ row }: any) => (
          <span className={cn(row.original.isSummary && 'font-bold')}>{row.original.regionName}</span>
        ),
      },
      {
        header: 'Ionlashtiruvchi nurlanish manbalari (INM)',
        id: 'irs',
        columns: [
          {
            header: 'Reyestrda',
            accessorKey: 'irsAll',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.irsAll} />,
          },
          {
            header: 'Amaldagi',
            accessorKey: 'irsActive',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.irsActive} tone="text-green-600" />,
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Reyestrdan <br /> chiqarilgan
              </div>
            ),
            accessorKey: 'irsInactive',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.irsInactive} tone="text-red-500" />,
          },
        ],
      },
      {
        header: 'Rentgen qurilmalari',
        id: 'xray',
        columns: [
          {
            header: 'Reyestrda',
            accessorKey: 'xrayAll',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.xrayAll} />,
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Muddati <br /> amalda
              </div>
            ),
            accessorKey: 'xrayValid',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.xrayValid} tone="text-green-600" />,
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Muddati <br /> o‘tgan
              </div>
            ),
            accessorKey: 'xrayExpired',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.xrayExpired} tone="text-red-500" />,
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Muddati <br /> kiritilmagan
              </div>
            ),
            accessorKey: 'xrayNoDate',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.xrayNoDate} tone="text-amber-600" />,
          },
          {
            header: () => (
              <div className="text-center whitespace-nowrap">
                Reyestrdan <br /> chiqarilgan
              </div>
            ),
            accessorKey: 'xrayInactive',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.xrayInactive} tone="text-red-500" />,
          },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="INM va Rentgen muddati o‘tganlar" />

        <Select value={String(regionParam)} onValueChange={(value) => addParams({ regionId: value })}>
          <SelectTrigger className="h-10 w-[220px] bg-white">
            <SelectValue placeholder="Hudud" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Barcha hududlar</SelectItem>
            {(regions ?? []).map((region: any) => (
              <SelectItem key={region.id} value={String(region.id)}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
          data={tableData}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          initialState={{ columnPinning: { left: ['regionName'] } }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default IrsXrayStatusReport

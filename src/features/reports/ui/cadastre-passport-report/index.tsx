import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { GoBack } from '@/shared/components/common'
import Filter from '@/shared/components/common/filter'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useData } from '@/shared/hooks'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useRegionSelectQuery } from '@/entities/admin/districts'
import { cn } from '@/shared/lib/utils'
import { CadastrePassportReportItem } from './types'

const ALL = 'ALL'

interface Row extends CadastrePassportReportItem {
  isSummary: boolean
}

const Count = ({ row, value, tone, bold }: { row: Row; value: number; tone?: string; bold?: boolean }) => (
  <span className={cn('tabular-nums', value === 0 ? 'text-gray-300' : tone, (bold || row.isSummary) && 'font-bold')}>
    {value}
  </span>
)

/** Ichki ustunlar (jami ichidagi taqsimot) bir xil ko‘rinishda beriladi. */
const subColumn = (header: React.ReactNode, key: keyof CadastrePassportReportItem, tone?: string) => ({
  header,
  accessorKey: key,
  id: key,
  className: 'text-center',
  cell: ({ row }: any) => <Count row={row.original} value={row.original[key]} tone={tone} />,
})

const CadastrePassportReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()
  const regionParam = paramsObject.regionId || ALL

  const { data: regions } = useRegionSelectQuery()

  const params = useMemo(() => {
    const result: Record<string, string> = {}
    // Bo‘sh qiymatlar so‘rovga umuman qo‘shilmaydi - backend ularni default bilan to‘ldiradi.
    if (paramsObject.startDate) result.startDate = String(paramsObject.startDate)
    if (paramsObject.endDate) result.endDate = String(paramsObject.endDate)
    if (regionParam !== ALL) result.regionId = String(regionParam)
    return result
  }, [paramsObject.startDate, paramsObject.endDate, regionParam])

  const { data, isLoading } = useData<CadastrePassportReportItem[]>('/reports/cadastre-passport', true, params)

  const tableData = useMemo<Row[]>(() => {
    if (!Array.isArray(data)) return []

    // Umumiy qator faqat regionId bo‘yicha aniqlanadi - nom tarjimaga bog‘liq.
    const rows = data.map((item) => ({ ...item, isSummary: item.regionId === null }))

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
        header: () => (
          <div className="text-center whitespace-nowrap">
            Jami kelib <br /> tushgan
          </div>
        ),
        accessorKey: 'totalCount',
        id: 'totalCount',
        className: 'text-center',
        cell: ({ row }: any) => <Count row={row.original} value={row.original.totalCount} bold />,
      },
      {
        header: () => (
          <div className="text-center whitespace-nowrap">
            Buyurtmachi <br /> tasdig‘ida
          </div>
        ),
        accessorKey: 'awaitingCustomerCount',
        id: 'awaitingCustomerCount',
        className: 'text-center',
        cell: ({ row }: any) => <Count row={row.original} value={row.original.awaitingCustomerCount} />,
      },
      {
        header: 'SES va FVV tasdiqlashida',
        id: 'inReview',
        columns: [
          {
            header: 'Jami',
            accessorKey: 'inReviewCount',
            id: 'inReviewCount',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.inReviewCount} bold />,
          },
          subColumn('Ikkalasida', 'awaitingBothCount'),
          subColumn('Faqat FVVda', 'awaitingFvvOnlyCount'),
          subColumn('Faqat SESda', 'awaitingSesOnlyCount'),
        ],
      },
      {
        header: 'Qo‘mitada',
        accessorKey: 'inCommitteeCount',
        id: 'inCommitteeCount',
        className: 'text-center',
        cell: ({ row }: any) => <Count row={row.original} value={row.original.inCommitteeCount} />,
      },
      {
        header: 'Tasdiqlangan',
        accessorKey: 'approvedCount',
        id: 'approvedCount',
        className: 'text-center',
        cell: ({ row }: any) => (
          <Count row={row.original} value={row.original.approvedCount} tone="text-green-600" bold />
        ),
      },
      {
        header: 'Rad etilgan',
        id: 'rejected',
        columns: [
          {
            header: 'Jami',
            accessorKey: 'rejectedCount',
            id: 'rejectedCount',
            className: 'text-center',
            cell: ({ row }: any) => (
              <Count row={row.original} value={row.original.rejectedCount} tone="text-red-500" bold />
            ),
          },
          subColumn('Buyurtmachi', 'rejectedByCustomerCount', 'text-red-500'),
          subColumn('FVV', 'rejectedByFvvCount', 'text-red-500'),
          subColumn('SES', 'rejectedBySesCount', 'text-red-500'),
          subColumn('Qo‘mita', 'rejectedByCommitteeCount', 'text-red-500'),
        ],
      },
    ],
    []
  )

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Kadastr pasportlari bo‘yicha hisobot" />

        <div className="flex flex-wrap items-center gap-2">
          <Filter className="mb-0" inputKeys={['startDate', 'endDate']} />

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

export default CadastrePassportReport

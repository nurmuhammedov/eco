import React, { useMemo } from 'react'
import { format, parseISO, startOfMonth } from 'date-fns'
import { DataTable } from '@/shared/components/common/data-table'
import { GoBack } from '@/shared/components/common'
import DatePicker from '@/shared/components/ui/datepicker'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useData } from '@/shared/hooks'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import { useHazardousFacilityCategoryDictionarySelect } from '@/shared/api/dictionaries'
import { cn } from '@/shared/lib/utils'

interface Row {
  regionId: number | null
  regionName: string
  totalCount: number
  riskBasedCount: number
  otherCount: number
}

const ALL = 'ALL'
const API_DATE = 'yyyy-MM-dd'

const Count = ({ row, value }: { row: Row; value: number }) => (
  <span className={cn('tabular-nums', row.regionId === null && 'font-bold')}>{value}</span>
)

const InspectionHfCategoryReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()

  // From the first of the month up to today, unless the user picks otherwise
  const startDate = String(paramsObject.startDate ?? format(startOfMonth(new Date()), API_DATE))
  const endDate = String(paramsObject.endDate ?? format(new Date(), API_DATE))
  const categoryId = String(paramsObject.categoryId ?? ALL)

  const { data: categories } = useHazardousFacilityCategoryDictionarySelect()

  const { data, isLoading } = useData<Row[]>('/reports/inspection/hf-by-category', true, {
    startDate,
    endDate,
    ...(categoryId !== ALL && { categoryId: Number(categoryId) }),
  })

  // The backend marks the country total by a null region; it belongs on top
  const tableData = useMemo<Row[]>(() => {
    const rows = Array.isArray(data) ? data : []

    return [
      ...rows.filter((row) => row.regionId === null).map((row) => ({ ...row, regionName: 'Respublika bo‘yicha' })),
      ...rows.filter((row) => row.regionId !== null),
    ]
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
          <span className={cn(row.original.regionId === null && 'font-bold')}>{row.original.regionName}</span>
        ),
      },
      {
        header: 'O‘tkazilgan tekshiruvlar',
        accessorKey: 'totalCount',
        className: 'text-center',
        cell: ({ row }: any) => <Count row={row.original} value={row.original.totalCount} />,
      },
      {
        header: 'shundan',
        id: 'breakdown',
        columns: [
          {
            header: 'xavf tahlili asosida',
            accessorKey: 'riskBasedCount',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.riskBasedCount} />,
          },
          {
            header: 'boshqa turdagi',
            accessorKey: 'otherCount',
            className: 'text-center',
            cell: ({ row }: any) => <Count row={row.original} value={row.original.otherCount} />,
          },
        ],
      },
    ],
    []
  )

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="XICHO toifalari bo‘yicha o‘tkazilgan tekshiruvlar" />

        <div className="flex flex-wrap items-center gap-2">
          <DatePicker
            value={parseISO(startDate)}
            onChange={(value) => value && addParams({ startDate: format(value, API_DATE) })}
            maxDate={parseISO(endDate)}
            placeholder="Dan"
            className="h-10 w-[150px] bg-white"
            isForm={false}
          />
          <DatePicker
            value={parseISO(endDate)}
            onChange={(value) => value && addParams({ endDate: format(value, API_DATE) })}
            minDate={parseISO(startDate)}
            placeholder="Gacha"
            className="h-10 w-[150px] bg-white"
            isForm={false}
          />
          <Select
            value={categoryId}
            onValueChange={(value) => addParams({ categoryId: value === ALL ? undefined : value })}
          >
            <SelectTrigger className="h-10 w-[280px] bg-white [&>span]:truncate">
              <SelectValue placeholder="XICHO toifasi" />
            </SelectTrigger>
            <SelectContent className="max-w-[min(640px,90vw)]">
              <SelectItem value={ALL}>Barcha toifalar</SelectItem>
              {(categories ?? []).map((category: { id: number; name: string }) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
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

export default InspectionHfCategoryReport

import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { getDefaultYearAndMonthForInspections } from '@/shared/utils/date'
import useCustomSearchParams from '@/shared/hooks/api/use-search-params'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { cn } from '@/shared/lib/utils'
import { useRegionSelectQuery } from '@/shared/api/dictionaries'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { isCountryTotal } from '../../lib/country-total'
import type { ExtendedColumnDef } from '@/shared/components/common/data-table/model/column-def'

/** ChecklistIssueByReport */
interface SectionCounts {
  allCount: number
  acceptedCount: number
  inProcessCount: number
  expiredCount: number
}

type Section = 'hf' | 'irs' | 'elevator' | 'attraction' | 'xray' | 'lpgPowered'

/** ReportByInspectionExecution */
type RegionCounts = { regionName: string } & Record<Section, SectionCounts | null>

/** The country total is put together here, so its sections may be missing */
type Row = { regionName: string; isSummary?: boolean } & Partial<Record<Section, SectionCounts | null>>

const MONTHS = [
  { value: 'JANUARY', label: 'Yanvar' },
  { value: 'FEBRUARY', label: 'Fevral' },
  { value: 'MARCH', label: 'Mart' },
  { value: 'APRIL', label: 'Aprel' },
  { value: 'MAY', label: 'May' },
  { value: 'JUNE', label: 'Iyun' },
  { value: 'JULY', label: 'Iyul' },
  { value: 'AUGUST', label: 'Avgust' },
  { value: 'SEPTEMBER', label: 'Sentabr' },
  { value: 'OCTOBER', label: 'Oktabr' },
  { value: 'NOVEMBER', label: 'Noyabr' },
  { value: 'DECEMBER', label: 'Dekabr' },
]

const currentYear = new Date().getFullYear()
// Same period the Tekshiruvlar page opens on: the first month of the current quarter.
const { year: defaultYearValue, month: defaultMonthValue } = getDefaultYearAndMonthForInspections()

const defaultYear = currentYear

const generateYears = () => {
  const years = []
  for (let i = 2025; i <= Math.max(currentYear, defaultYear); i++) {
    years.push(i)
  }
  return years
}

const InspectionExecutionReport: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams()

  const year = String(paramsObject.year ?? defaultYearValue)
  const month = String(paramsObject.month ?? defaultMonthValue)
  const regionName = String(paramsObject.regionName ?? 'ALL')

  const { data: regionsList } = useRegionSelectQuery()

  const { data: rawData, isLoading } = useData<RegionCounts[]>('/reports/inspection-execution', true, {
    year: Number(year),
    month,
  })

  const tableData = useMemo(() => {
    if (!rawData) return []
    const regions = rawData.filter((r) => !isCountryTotal(r.regionName))
    const backendSummary = rawData.find((r) => isCountryTotal(r.regionName))

    const summaryRow: Row = {
      ...backendSummary,
      regionName: 'Respublika bo‘yicha',
      isSummary: true,
    }

    let filteredRegions = regions
    if (regionName !== 'ALL' && regionName !== 'Respublika bo‘yicha') {
      filteredRegions = regions.filter((r) => r.regionName === regionName)
    } else if (regionName === 'Respublika bo‘yicha') {
      filteredRegions = []
    }

    return [summaryRow, ...filteredRegions]
  }, [rawData, regionName])

  const createSectionColumns = (header: string, accessorPrefix: Section): ExtendedColumnDef<Row, number> => ({
    header,
    id: accessorPrefix,
    columns: [
      {
        header: 'Jami chora\u00A0tadbirlar',
        id: `${accessorPrefix}_allCount`,
        accessorFn: (row) => row[accessorPrefix]?.allCount || 0,
        className: 'text-center text-slate-900',
        cell: ({ row, getValue }) => {
          return <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        },
      },
      {
        header: 'Yakunlanganlar',
        id: `${accessorPrefix}_acceptedCount`,
        accessorFn: (row) => row[accessorPrefix]?.acceptedCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }) => {
          return (
            <span className={row.original.isSummary ? 'font-bold text-green-600' : 'text-green-600'}>{getValue()}</span>
          )
        },
      },
      {
        header: 'Jarayondagilar',
        id: `${accessorPrefix}_inProcessCount`,
        accessorFn: (row) => row[accessorPrefix]?.inProcessCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }) => {
          return (
            <span className={row.original.isSummary ? 'font-bold text-orange-500' : 'text-orange-500'}>
              {getValue()}
            </span>
          )
        },
      },
      {
        header: 'Bajarilmaganlar',
        id: `${accessorPrefix}_expiredCount`,
        accessorFn: (row) => row[accessorPrefix]?.expiredCount || 0,
        className: 'text-center text-slate-700 font-medium',
        cell: ({ row, getValue }) => {
          return (
            <span className={row.original.isSummary ? 'font-bold text-red-500' : 'text-red-500'}>{getValue()}</span>
          )
        },
      },
    ],
  })

  const columns: ExtendedColumnDef<Row, number>[] = [
    {
      header: 'Hududlar',
      accessorKey: 'regionName',
      id: 'regionName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)]',
      cell: ({ row }) => {
        const value = row.original.regionName
        return <span className={cn(row.original.isSummary ? 'font-bold' : '')}>{value}</span>
      },
    },
    createSectionColumns('XICHO', 'hf'),
    createSectionColumns('INM', 'irs'),
    createSectionColumns('Lift', 'elevator'),
    createSectionColumns('Attraksion', 'attraction'),
    createSectionColumns('Rentgen', 'xray'),
    createSectionColumns('Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma', 'lpgPowered'),
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 p-0.5 xl:flex-row xl:items-center">
        <GoBack title="Tekshiruvlarning chora tadbirlari bo‘yicha hisobot" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={year} onValueChange={(val) => addParams({ year: val })}>
            <SelectTrigger className="h-10 w-[120px] bg-white text-sm">
              <SelectValue placeholder="Yilni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={(val) => addParams({ month: val })}>
            <SelectTrigger className="w-full bg-white md:w-[200px]">
              <SelectValue placeholder="Oyni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={regionName} onValueChange={(val) => addParams({ regionName: val })}>
            <SelectTrigger className="h-10 w-[220px] bg-white text-sm">
              <SelectValue placeholder="Hududni tanlang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              <SelectItem value="Respublika bo‘yicha">Respublika bo‘yicha</SelectItem>
              {regionsList?.map((region) => (
                <SelectItem key={region.id} value={region.name}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns}
          data={tableData || []}
          isLoading={isLoading}
          isPaginated={false}
          showNumeration={false}
          headerCenter={true}
          isHeaderSticky={true}
          initialState={{
            columnPinning: {
              left: ['regionName'],
            },
          }}
          className="h-full"
        />
      </div>
    </div>
  )
}

export default InspectionExecutionReport

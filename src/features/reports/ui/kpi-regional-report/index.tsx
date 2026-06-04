import React, { useState } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { getQuarter, subQuarters } from 'date-fns'
import { cn } from '@/shared/lib/utils'

const QUARTERS = [
  { value: '1', label: '1-chorak' },
  { value: '2', label: '2-chorak' },
  { value: '3', label: '3-chorak' },
  { value: '4', label: '4-chorak' },
]

const currentYear = new Date().getFullYear()
const generateYears = () => {
  const years = []
  for (let i = 2025; i <= currentYear; i++) {
    years.push(i)
  }
  return years
}

const KpiRegionalReport: React.FC = () => {
  const previousQuarterDate = subQuarters(new Date(), 2)
  const defaultYear = previousQuarterDate.getFullYear().toString()
  const defaultQuarter = getQuarter(previousQuarterDate).toString()

  const [year, setYear] = useState<string>(defaultYear)
  const [quarter, setQuarter] = useState<string>(defaultQuarter)

  const { data: rawData, isLoading } = useData<any[]>('/reports/kpi-regional', true, {
    year: Number(year),
    quarter: Number(quarter),
  })

  const tableData = React.useMemo(() => {
    if (!rawData) return []
    const regions = rawData.filter((r) => r.regionId !== null)
    const summary = rawData.find((r) => r.regionId === null)

    const result = []
    if (summary) result.push({ ...summary, isSummary: true, regionName: 'Respublika bo‘yicha' })
    result.push(...regions)
    return result
  }, [rawData])

  const columns: any[] = [
    {
      header: 'Hududlar',
      accessorKey: 'regionName',
      id: 'regionName',
      minSize: 200,
      className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
      cell: ({ row }: any) => (
        <span className={row.original.isSummary ? 'font-bold' : ''}>{row.original.regionName}</span>
      ),
    },
    {
      header: 'KPI ko‘rsatkichi % da',
      id: 'kpiPercentage',
      accessorFn: (row: any) => {
        const prev = row.riskAnalysis?.previousMediumCount ?? 0
        const low = row.riskAnalysis?.currentLowCount ?? 0
        const out = row.riskAnalysis?.currentInActiveCount ?? 0
        if (prev === 0) return 0
        return ((low + out) / prev) * 100
      },
      className: 'text-center font-semibold',
      cell: ({ row, getValue }: any) => {
        const val = getValue()
        const percentage = Math.round(val)
        let colorClass = 'text-red-600'
        if (percentage >= 50) colorClass = 'text-green-600'
        else if (percentage >= 31) colorClass = 'text-amber-500'

        return (
          <div className={cn('flex items-center justify-center gap-1', row.original.isSummary ? 'font-bold' : '')}>
            <span className={cn('text-sm', colorClass)}>{percentage}%</span>
          </div>
        )
      },
    },
    {
      header: 'Xavf tahlili natijasi',
      id: 'riskAnalysisGroup',
      columns: [
        {
          header: 'Oldingi o‘rta xavf',
          id: 'previousMediumCount',
          accessorFn: (row: any) => row.riskAnalysis?.previousMediumCount ?? 0,
          className: 'text-center whitespace-nowrap text-slate-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavfi past',
          id: 'currentLowCount',
          accessorFn: (row: any) => row.riskAnalysis?.currentLowCount ?? 0,
          className: 'text-center whitespace-nowrap text-green-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavfi o‘rta',
          id: 'currentMediumCount',
          accessorFn: (row: any) => row.riskAnalysis?.currentMediumCount ?? 0,
          className: 'text-center whitespace-nowrap text-amber-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavfi yuqori',
          id: 'currentHighCount',
          accessorFn: (row: any) => row.riskAnalysis?.currentHighCount ?? 0,
          className: 'text-center whitespace-nowrap text-red-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Ro‘yxatdan chiqarilgan',
          id: 'currentInActiveCount',
          accessorFn: (row: any) => row.riskAnalysis?.currentInActiveCount ?? 0,
          className: 'text-center whitespace-nowrap text-slate-500',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
      ],
    },
    {
      header: 'Baxtsiz hodisalar va avariyalar',
      id: 'accidentsGroup',
      columns: [
        {
          header: 'Baxtsiz hodisalar KPI ko‘rsatkichi % da',
          id: 'injuryAccidentPercent',
          accessorFn: (row: any) => (row.injuryAccident > 0 ? 0 : 100),
          className: 'text-center whitespace-nowrap font-semibold',
          cell: ({ row, getValue }: any) => {
            const val = getValue()
            const colorClass = val === 100 ? 'text-green-600' : 'text-red-600'
            return <span className={cn(colorClass, row.original.isSummary ? 'font-bold' : '')}>{val}%</span>
          },
        },
        {
          header: 'Baxtsiz hodisalar',
          id: 'injuryAccident',
          accessorKey: 'injuryAccident',
          className: 'text-center whitespace-nowrap',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Avariyalar KPI ko‘rsatkichi % da',
          id: 'nonInjuryAccidentPercent',
          accessorFn: (row: any) => (row.nonInjuryAccident > 0 ? 0 : 100),
          className: 'text-center whitespace-nowrap font-semibold',
          cell: ({ row, getValue }: any) => {
            const val = getValue()
            const colorClass = val === 100 ? 'text-green-600' : 'text-red-600'
            return <span className={cn(colorClass, row.original.isSummary ? 'font-bold' : '')}>{val}%</span>
          },
        },
        {
          header: 'Avariyalar',
          id: 'nonInjuryAccident',
          accessorKey: 'nonInjuryAccident',
          className: 'text-center whitespace-nowrap',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="mb-2 flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
        <GoBack title="Hududlarning KPI ko‘rsatkichi hisoboti" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={year} onValueChange={setYear}>
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

          <Select value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="h-10 w-[160px] bg-white text-sm">
              <SelectValue placeholder="Chorakni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {QUARTERS.map((q) => (
                <SelectItem key={q.value} value={q.value}>
                  {q.label}
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

export default KpiRegionalReport

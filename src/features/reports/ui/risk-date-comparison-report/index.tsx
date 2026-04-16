import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { RiskAnalysisTab } from '@/widgets/risk-analysis/types'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { getQuarter, subQuarters } from 'date-fns'
import { RiskStatisticsCards } from '@/widgets/risk-analysis/ui/parts/risk-statistics-cards'

const QUARTERS = [
  { value: '1', label: '1-chorak' },
  { value: '2', label: '2-chorak' },
  { value: '3', label: '3-chorak' },
  { value: '4', label: '4-chorak' },
]

const currentYear = new Date().getFullYear()

const TAB_TO_API_TYPE: Record<string, string> = {
  [RiskAnalysisTab.XICHO]: 'HF',
  [RiskAnalysisTab.INM]: 'IRS',
  [RiskAnalysisTab.LIFT]: 'ELEVATOR',
  [RiskAnalysisTab.ATTRACTION]: 'ATTRACTION',
  [RiskAnalysisTab.XRAY]: 'XRAY',
  [RiskAnalysisTab.LPG_POWERED]: 'LPG_POWERED',
}

const RiskDateComparisonReport: React.FC = () => {
  const { t } = useTranslation('common')

  const previousQuarterDate = subQuarters(new Date(), 2)
  const defaultYear = previousQuarterDate.getFullYear().toString()
  const defaultQuarter = getQuarter(previousQuarterDate).toString()

  const {
    addParams,
    paramsObject: {
      mainTab = RiskAnalysisTab.XICHO,
      year = defaultYear,
      quarter = defaultQuarter,
      riskLevel = 'LOW',
      regionName = 'all',
    },
  } = useCustomSearchParams()

  const { data: dynamicsData, isLoading: dynamicsLoading } = useData<any[]>('/reports/risk-analysis/dynamic', true, {
    year: Number(year),
    quarter: Number(quarter),
    level: riskLevel,
    type: TAB_TO_API_TYPE[mainTab] || 'HF',
  })

  const generateYears = () => {
    const years = []
    for (let i = 2025; i <= currentYear; i++) {
      years.push(i)
    }
    return years
  }

  const rawList: any[] = useMemo(() => {
    if (!dynamicsData) return []
    if (Array.isArray(dynamicsData)) return dynamicsData
    if (Array.isArray((dynamicsData as any)?.data)) return (dynamicsData as any).data
    return []
  }, [dynamicsData])

  const { tableData, columns } = useMemo(() => {
    const dateSet = new Set<string>()

    const filteredRawList = rawList.filter((item: any) => {
      if (regionName === 'all') return true
      return item.regionName === regionName
    })

    const mapped = filteredRawList.map((item: any) => {
      const months: any = {}
      const dynList: any[] = Array.isArray(item.dynamics) ? item.dynamics : []

      dynList.forEach((d: any) => {
        if (!d.date) return
        const key = d.date.split('-').reverse().join('.')
        dateSet.add(key)
        months[key] = {
          low: d.lowCount ?? 0,
          mid: d.mediumCount ?? 0,
          high: d.highCount ?? 0,
          out: d.deregisteredCount ?? 0,
        }
      })

      const latest = dynList.length > 0 ? dynList[dynList.length - 1] : null

      return {
        regionName: item.regionName,
        isSummary:
          item.regionName?.toLowerCase().includes("bo'yicha") || item.regionName?.toLowerCase().includes('bo‘yicha'),
        totalCapacity: item.analysisCount ?? 0,
        currentStatusValue: latest ? (latest.currentCount ?? 0) : 0,
        currentLow: latest ? (latest.lowCount ?? 0) : 0,
        currentMid: latest ? (latest.mediumCount ?? 0) : 0,
        currentOut: latest ? (latest.deregisteredCount ?? 0) : 0,
        months,
      }
    })

    const sortedDates = Array.from(dateSet).sort((a, b) => {
      const parse = (s: string) => {
        const [dd, mm, yyyy] = s.split('.').map(Number)
        return new Date(yyyy, mm - 1, dd).getTime()
      }
      return parse(a) - parse(b)
    })

    const dateColumns = sortedDates.map((date) => ({
      header: date,
      id: `date_${date}`,
      columns: [
        {
          header: 'Xavfi past',
          id: `low_${date}`,
          accessorFn: (row: any) => row.months[date]?.low ?? 0,
          className: 'whitespace-nowrap text-green-600 text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavfi o‘rta',
          id: `mid_${date}`,
          accessorFn: (row: any) => row.months[date]?.mid ?? 0,
          className: 'whitespace-nowrap text-amber-600 text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavfi yuqori',
          id: `high_${date}`,
          accessorFn: (row: any) => row.months[date]?.high ?? 0,
          className: 'whitespace-nowrap text-red-600 text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Ro‘yxatdan chiqarilgan',
          id: `out_${date}`,
          accessorFn: (row: any) => row.months[date]?.out ?? 0,
          className: 'whitespace-nowrap text-slate-500 text-center',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
      ],
    }))

    const cols = [
      {
        header: 'Hududlar',
        accessorKey: 'regionName',
        id: 'regionName',
        minSize: 200,
        className: 'sticky left-0 z-20 border-r shadow-[1px_0_0_0_rgba(0,0,0,0.1)] bg-white',
        cell: ({ row }: any) => {
          const value = row.original.regionName
          const isSummary = row.original.isSummary
          return <span className={isSummary ? 'font-bold' : ''}>{isSummary ? 'Respublika bo‘yicha' : value}</span>
        },
      },
      {
        header: () => (
          <div className="text-center whitespace-nowrap">
            {year}-yil {quarter}-chorak yakunidagi <br /> xavf tahlili natijasi bo‘yicha soni
          </div>
        ),
        accessorKey: 'totalCapacity',
        id: 'totalCapacity',
        className: 'whitespace-nowrap text-center font-semibold',
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: () => (
          <div className="text-center whitespace-nowrap">
            KPI ko‘rsatkichi <br /> % da
          </div>
        ),
        accessorKey: 'currentStatusValue',
        id: 'currentStatusValue',
        className: 'whitespace-nowrap text-center font-semibold',
        cell: ({ row }: any) => {
          const totalInitial = row.original.totalCapacity
          const low = row.original.currentLow
          const mid = row.original.currentMid
          const out = row.original.currentOut

          let kpi = 0
          let kpiWithoutOut = 0
          if (riskLevel === 'MEDIUM') {
            kpi = totalInitial > 0 ? ((low + out) / totalInitial) * 100 : 0
            kpiWithoutOut = totalInitial > 0 ? (low / totalInitial) * 100 : 0
          } else if (riskLevel === 'HIGH') {
            kpi = totalInitial > 0 ? ((low + mid + out) / totalInitial) * 100 : 0
            kpiWithoutOut = totalInitial > 0 ? ((low + mid) / totalInitial) * 100 : 0
          }

          const percentage = Math.round(kpi)
          const percentageWithoutOut = Math.round(kpiWithoutOut)

          let colorClass = 'text-red-600'
          if (percentage >= 50) colorClass = 'text-green-600'
          else if (percentage >= 31) colorClass = 'text-amber-500'

          const isSummary = row.original.isSummary
          return (
            <div className={cn('flex items-center justify-center gap-1', isSummary ? 'font-bold' : '')}>
              <span className={cn('text-sm', colorClass)}>{percentage}%</span>
              <span className="text-sm text-slate-500">({percentageWithoutOut}%)</span>
            </div>
          )
        },
      },
      ...dateColumns,
    ]

    const groupedCols = [
      ...cols.slice(0, 3),
      ...(dateColumns.length > 0
        ? [
            {
              header: 'Qayta xavf tahlili o‘tkazilgan sanalar',
              id: 'dates_group',
              columns: dateColumns,
            },
          ]
        : []),
    ]

    return { tableData: mapped, columns: groupedCols }
  }, [rawList, regionName, riskLevel])

  const regionOptions = useMemo(() => {
    const names = rawList.map((item: any) => item.regionName).filter(Boolean)
    return Array.from(new Set(names))
  }, [rawList])

  const handleRiskLevelChange = (level: string) => {
    addParams({ riskLevel: level })
  }

  return (
    <div className="flex h-full flex-col gap-1 overflow-hidden">
      <div className="flex flex-col justify-between gap-4 p-0.5 xl:flex-row xl:items-center">
        <GoBack title="Xavf tahlili natijasi bo‘yicha muddatlar o‘rtasida solishtirish hisoboti" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={regionName} onValueChange={(val) => addParams({ regionName: val })}>
            <SelectTrigger className="h-10 w-[220px] bg-white">
              <SelectValue placeholder="Hudud" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              {regionOptions.map((name: string) => {
                const isSummary = name.toLowerCase().includes("bo'yicha") || name.toLowerCase().includes('bo‘yicha')
                return (
                  <SelectItem key={name} value={name}>
                    {isSummary ? 'Respublika bo‘yicha' : name}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>

          <Select value={year?.toString()} onValueChange={(val) => addParams({ year: val })}>
            <SelectTrigger className="h-10 w-[120px] bg-white">
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((y) => (
                <SelectItem key={y?.toString()} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={quarter?.toString()} onValueChange={(val) => addParams({ quarter: val })}>
            <SelectTrigger className="h-10 w-[160px] bg-white">
              <SelectValue placeholder="Chorak" />
            </SelectTrigger>
            <SelectContent>
              {QUARTERS.map((q) => (
                <SelectItem key={q.value?.toString()} value={q.value?.toString()}>
                  {q.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={mainTab} onValueChange={(tab) => addParams({ mainTab: tab })} className="w-full">
        <div className={cn('scrollbar-hidden mb-2 flex justify-between overflow-x-auto overflow-y-hidden')}>
          <TabsList>
            <TabsTrigger value={RiskAnalysisTab.XICHO}>{t('risk_analysis_tabs.XICHO')}</TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.INM}>{t('risk_analysis_tabs.INM')}</TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.LIFT}>{t('risk_analysis_tabs.LIFT')}</TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.ATTRACTION}>{t('risk_analysis_tabs.ATTRACTION')}</TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.XRAY}>{t('risk_analysis_tabs.XRAY')}</TabsTrigger>
            <TabsTrigger value={RiskAnalysisTab.LPG_POWERED}>{t('risk_analysis_tabs.LPG_POWERED')}</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      <RiskStatisticsCards
        type={TAB_TO_API_TYPE[mainTab] || 'HF'}
        activeRiskLevel={riskLevel}
        onTabChange={handleRiskLevelChange}
        year={year}
        quarter={quarter}
        showAllCard={false}
        className="mb-1"
      />

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
          data={tableData}
          isLoading={dynamicsLoading}
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

export default RiskDateComparisonReport

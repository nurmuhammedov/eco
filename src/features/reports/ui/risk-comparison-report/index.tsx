import React, { useMemo } from 'react'
import { DataTable } from '@/shared/components/common/data-table'
import { useData, useCustomSearchParams } from '@/shared/hooks'
import { GoBack } from '@/shared/components/common'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { RiskAnalysisTab } from '@/widgets/risk-analysis/types'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'
import { getQuarter, subQuarters } from 'date-fns'

const QUARTERS = [
  { value: '1', label: '1-chorak' },
  { value: '2', label: '2-chorak' },
  { value: '3', label: '3-chorak' },
  { value: '4', label: '4-chorak' },
]

const currentYear = new Date().getFullYear()

const RiskComparisonReport: React.FC = () => {
  const { t } = useTranslation('common')

  const previousQuarterDate = subQuarters(new Date(), 1)
  const defaultYear = previousQuarterDate.getFullYear().toString()
  const defaultQuarter = getQuarter(previousQuarterDate).toString()

  const {
    addParams,
    paramsObject: { mainTab = RiskAnalysisTab.XICHO, year = defaultYear, quarter = defaultQuarter },
  } = useCustomSearchParams()

  const { data: regionsData, isLoading: regionsLoading } = useData<any[]>('/regions/select', true)

  const generateYears = () => {
    const years = []
    for (let i = 2024; i <= currentYear; i++) {
      years.push(i)
    }
    return years
  }

  const tableData = useMemo(() => {
    if (!regionsData) return []

    const mockRow = (regionName: string, isSummary = false) => {
      const getRandom = (max: number) => Math.floor(Math.random() * max)

      const low_current = getRandom(100)
      const mid_current = getRandom(60)
      const high_current = getRandom(30)

      const splitValue = (total: number) => {
        const v1 = getRandom(total + 1)
        const v2 = getRandom(total - v1 + 1)
        const v3 = getRandom(total - v1 - v2 + 1)
        const v4 = total - v1 - v2 - v3
        return [v1, v2, v3, v4]
      }

      const [ln_low, ln_mid, ln_high, ln_out] = splitValue(low_current)
      const [mn_low, mn_mid, mn_high, mn_out] = splitValue(mid_current)
      const [hn_low, hn_mid, hn_high, hn_out] = splitValue(high_current)

      return {
        regionName,
        isSummary,
        low_current,
        mid_current,
        high_current,
        low_next: {
          next: getRandom(100),
          trend: Math.random() > 0.5 ? 'up' : 'down',
          low: ln_low,
          mid: ln_mid,
          high: ln_high,
          out: ln_out,
        },
        mid_next: {
          next: getRandom(60),
          trend: Math.random() > 0.5 ? 'up' : 'down',
          low: mn_low,
          mid: mn_mid,
          high: mn_high,
          out: mn_out,
        },
        high_next: {
          next: getRandom(30),
          trend: Math.random() > 0.5 ? 'up' : 'down',
          low: hn_low,
          mid: hn_mid,
          high: hn_high,
          out: hn_out,
        },
      }
    }

    const summaryRow = mockRow('Respublika bo‘yicha', true)
    const list = regionsData.map((r) => mockRow(r.nameUz || r.name))

    return [summaryRow, ...list]
  }, [regionsData])

  const createNextQuarterSubgroup = (header: string, accessorPrefix: string) => ({
    header,
    id: accessorPrefix,
    className: 'whitespace-nowrap',
    columns: [
      {
        header: 'Keyingi tahlil',
        id: `${accessorPrefix}_next`,
        className: 'whitespace-nowrap',
        accessorFn: (row: any) => row[accessorPrefix]?.next || 0,
        cell: ({ row, getValue }: any) => {
          const val = getValue()
          const trend = row.original[accessorPrefix]?.trend
          return (
            <div className={cn('flex items-center gap-1', row.original.isSummary ? 'font-bold' : '')}>
              {val}
              {trend === 'up' ? (
                <TrendingUp size={14} className="text-green-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
            </div>
          )
        },
      },
      {
        header: 'Xavf past',
        id: `${accessorPrefix}_low`,
        className: 'whitespace-nowrap text-green-600',
        accessorFn: (row: any) => row[accessorPrefix]?.low || 0,
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Xavf o‘rta',
        id: `${accessorPrefix}_mid`,
        className: 'whitespace-nowrap text-amber-600',
        accessorFn: (row: any) => row[accessorPrefix]?.mid || 0,
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Xavf yuqori',
        id: `${accessorPrefix}_high`,
        className: 'whitespace-nowrap text-red-600',
        accessorFn: (row: any) => row[accessorPrefix]?.high || 0,
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
      {
        header: 'Reyestrdan chiqarilgan',
        id: `${accessorPrefix}_out`,
        className: 'whitespace-nowrap',
        accessorFn: (row: any) => row[accessorPrefix]?.out || 0,
        cell: ({ row, getValue }: any) => (
          <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
        ),
      },
    ],
  })

  const columns = [
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
      header: 'Belgilangan chorak tahlili',
      columns: [
        {
          header: 'Xavf past (0-60)',
          accessorKey: 'low_current',
          className: 'whitespace-nowrap text-green-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavf o‘rta (61-80)',
          accessorKey: 'mid_current',
          className: 'whitespace-nowrap text-amber-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
        {
          header: 'Xavf yuqori (81-100)',
          accessorKey: 'high_current',
          className: 'whitespace-nowrap text-red-600',
          cell: ({ row, getValue }: any) => (
            <span className={row.original.isSummary ? 'font-bold' : ''}>{getValue()}</span>
          ),
        },
      ],
    },
    {
      header: 'Navbatdagi chorak tahlili',
      columns: [
        createNextQuarterSubgroup('Xavf past (0-40)', 'low_next'),
        createNextQuarterSubgroup('Xavf o‘rta (41-80)', 'mid_next'),
        createNextQuarterSubgroup('Xavf yuqori (81-100)', 'high_next'),
      ],
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <GoBack title="Xavf tahlili natijasi bo‘yicha choraklar o‘rtasida solishtirish hisoboti" />

        <div className="flex flex-wrap items-center gap-2">
          <Select value={year} onValueChange={(val) => addParams({ year: val })}>
            <SelectTrigger className="h-10 w-[120px] bg-white">
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent>
              {generateYears().map((y) => (
                <SelectItem key={y} value={y.toString()}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={quarter} onValueChange={(val) => addParams({ quarter: val })}>
            <SelectTrigger className="h-10 w-[160px] bg-white">
              <SelectValue placeholder="Chorak" />
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

      <div className="flex-1 overflow-hidden rounded-md border bg-white shadow-sm">
        <DataTable
          columns={columns as any}
          data={tableData}
          isLoading={regionsLoading}
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

export default RiskComparisonReport

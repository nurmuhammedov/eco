import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { getMonth, subMonths } from 'date-fns'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useRiskAnalysisStats } from '../model/use-risk-analysis-stats'
import { StatValue } from './stat-value'

interface RiskCenterProps {
  regionId?: string | null
}

interface RiskItem {
  key?: string
  name?: string
  objectName?: string
  count: number
}

interface RiskSectionProps {
  title: string
  count: number
  items: RiskItem[]
  headerClass: string
  dotClass: string
  isLoading?: boolean
  buildHref: (item: RiskItem) => string
}

const MONTHS = [
  { id: 'JANUARY', name: 'Yanvar' },
  { id: 'FEBRUARY', name: 'Fevral' },
  { id: 'MARCH', name: 'Mart' },
  { id: 'APRIL', name: 'Aprel' },
  { id: 'MAY', name: 'May' },
  { id: 'JUNE', name: 'Iyun' },
  { id: 'JULY', name: 'Iyul' },
  { id: 'AUGUST', name: 'Avgust' },
  { id: 'SEPTEMBER', name: 'Sentabr' },
  { id: 'OCTOBER', name: 'Oktabr' },
  { id: 'NOVEMBER', name: 'Noyabr' },
  { id: 'DECEMBER', name: 'Dekabr' },
]

/** Risk analysis data starts here; offering earlier years would return nothing. */
const FIRST_ANALYSIS_YEAR = 2025

const RiskSection = ({ title, count, items, headerClass, dotClass, isLoading, buildHref }: RiskSectionProps) => (
  <section className="space-y-4">
    <div className={cn('flex items-center justify-between rounded-md p-3', headerClass)}>
      <h3 className="font-semibold">{title}</h3>
      <StatValue value={count} isLoading={isLoading} className="text-lg font-bold" skeletonClassName="h-6 w-8" />
    </div>

    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.key ?? item.name}>
          <Link
            to={buildHref(item)}
            className="flex items-center justify-between rounded-md border border-transparent p-2 text-sm transition-colors hover:border-slate-100 hover:bg-slate-50"
          >
            <span className="flex items-center gap-3">
              <span aria-hidden="true" className={cn('h-2.5 w-2.5 min-w-[10px] rounded-full', dotClass)} />
              <span className="leading-tight font-medium text-slate-700">{item.objectName || item.name}</span>
            </span>
            <StatValue
              value={item.count}
              isLoading={isLoading}
              className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-900"
              skeletonClassName="h-5 w-8"
            />
          </Link>
        </li>
      ))}
    </ul>
  </section>
)

export const RiskCenter = ({ regionId }: RiskCenterProps) => {
  const previousMonthDate = subMonths(new Date(), 1)
  const [year, setYear] = useState(previousMonthDate.getFullYear().toString())
  const [month, setMonth] = useState(MONTHS[getMonth(previousMonthDate)].id)

  const years = useMemo(() => {
    const current = new Date().getFullYear()
    const span = Math.max(current - FIRST_ANALYSIS_YEAR + 1, 1)

    return Array.from({ length: span }, (_, index) => FIRST_ANALYSIS_YEAR + index)
  }, [])

  const stats = useRiskAnalysisStats({ year: parseInt(year), month, regionId })

  const buildRiskUrl = (level?: string, item?: RiskItem) => {
    const params = new URLSearchParams()

    if (item?.key) params.set('mainTab', item.key)
    if (level) params.set('riskLevel', level)
    params.set('year', year)
    params.set('month', month)
    if (regionId) params.set('regionId', regionId)

    return `/risk-analysis?${params.toString()}`
  }

  const sections = [
    {
      title: 'Xavfi past',
      level: 'LOW',
      count: stats.lowRisk,
      items: stats.lowRiskList,
      headerClass: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
      dotClass: 'bg-emerald-500',
    },
    {
      title: 'Xavfi o‘rta',
      level: 'MEDIUM',
      count: stats.mediumRisk,
      items: stats.mediumRiskList,
      headerClass: 'bg-amber-50 border border-amber-200 text-amber-700',
      dotClass: 'bg-amber-500',
    },
    {
      title: 'Xavfi yuqori',
      level: 'HIGH',
      count: stats.highRisk,
      items: stats.highRiskList,
      headerClass: 'bg-rose-50 border border-rose-200 text-rose-700',
      dotClass: 'bg-rose-500',
    },
  ]

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold text-slate-800">Xavf tahlil natijasi</h2>

        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger aria-label="Yil" className="w-28">
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent align="end">
              {years.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger aria-label="Oy" className="w-36">
              <SelectValue placeholder="Oy" />
            </SelectTrigger>
            <SelectContent align="end">
              {MONTHS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <RiskSection
            key={section.level}
            title={section.title}
            count={section.count}
            items={section.items}
            headerClass={section.headerClass}
            dotClass={section.dotClass}
            isLoading={stats.isLoading}
            buildHref={(item) => buildRiskUrl(section.level, item)}
          />
        ))}
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <Link
          to={buildRiskUrl()}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-slate-800 py-2.5 text-white transition-colors hover:bg-slate-900"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span>Batafsil tahlilni ko‘rish</span>
        </Link>
      </div>
    </div>
  )
}

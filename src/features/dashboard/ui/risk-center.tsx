import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { useRiskAnalysisStats } from '../model/use-risk-analysis-stats'

interface RiskCenterProps {
  regionId?: string | null
}

const RiskSection = ({ title, count, items, bgClass, dotClass, onItemClick }: any) => (
  <div className="space-y-4">
    <div className={cn('flex items-center justify-between rounded-md p-3 text-white', bgClass)}>
      <span className="font-semibold">{title}</span>
      <span className="text-lg font-bold">{count}</span>
    </div>
    <div className="space-y-1">
      {items.map((item: any, idx: number) => (
        <div
          key={idx}
          onClick={() => onItemClick(item)}
          className="flex cursor-pointer items-center justify-between rounded-md border border-transparent p-2 text-sm transition-colors hover:border-slate-100 hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <span className={cn('h-2.5 w-2.5 min-w-[10px] rounded-full', dotClass)}></span>
            <span className="leading-tight font-medium text-slate-700">{item.objectName || item.name}</span>
          </div>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-900">{item.count}</span>
        </div>
      ))}
    </div>
  </div>
)

import { subMonths, getMonth } from 'date-fns'

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

export const RiskCenter = ({ regionId }: RiskCenterProps) => {
  const navigate = useNavigate()

  const previousMonthDate = subMonths(new Date(), 1)
  const defaultYear = previousMonthDate.getFullYear().toString()
  const defaultMonth = MONTHS[getMonth(previousMonthDate)].id

  const [year, setYear] = useState(defaultYear)
  const [month, setMonth] = useState(defaultMonth)

  const years = Array.from({ length: 100 }, (_, i) => 2025 + i)

  const stats = useRiskAnalysisStats({
    year: parseInt(year),
    month,
    regionId,
  })

  const handleItemClick = (item: any, level: string) => {
    const params = new URLSearchParams()
    if (item.key) params.set('mainTab', item.key)
    params.set('riskLevel', level)
    params.set('year', year)
    params.set('month', month)
    if (regionId) params.set('regionId', regionId)

    navigate(`/risk-analysis?${params.toString()}`)
  }

  const handleViewAll = () => {
    const params = new URLSearchParams()
    params.set('year', year)
    params.set('month', month)
    if (regionId) params.set('regionId', regionId)
    navigate(`/risk-analysis?${params.toString()}`)
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h3 className="text-lg font-semibold text-slate-800">Xavf tahlil natijasi</h3>
        <div className="flex items-center gap-2">
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="h-8 w-auto border-slate-200 bg-slate-50 px-2 text-xs focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Yil" />
            </SelectTrigger>
            <SelectContent align="end">
              {years.map((y) => (
                <SelectItem key={y} value={y.toString()} className="text-xs">
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="h-8 w-auto border-slate-200 bg-slate-50 px-2 text-xs focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Oy" />
            </SelectTrigger>
            <SelectContent align="end">
              {MONTHS.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs">
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Low Risk */}
        <div className="space-y-4">
          <RiskSection
            title="Xavfi past"
            count={stats.lowRisk}
            items={stats.lowRiskList}
            bgClass="bg-emerald-50 border border-emerald-200 text-emerald-700"
            dotClass="bg-emerald-500"
            onItemClick={(item: any) => handleItemClick(item, 'LOW')}
          />
        </div>

        {/* Medium Risk */}
        <div className="space-y-4">
          <RiskSection
            title="Xavfi o‘rta"
            count={stats.mediumRisk}
            items={stats.mediumRiskList}
            bgClass="bg-amber-50 border border-amber-200 text-amber-700"
            dotClass="bg-amber-500"
            onItemClick={(item: any) => handleItemClick(item, 'MEDIUM')}
          />
        </div>

        {/* High Risk */}
        <div className="space-y-4">
          <RiskSection
            title="Xavfi yuqori"
            count={stats.highRisk}
            items={stats.highRiskList}
            bgClass="bg-rose-50 border border-rose-200 text-rose-700"
            dotClass="bg-rose-500"
            onItemClick={(item: any) => handleItemClick(item, 'HIGH')}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <button
          onClick={handleViewAll}
          className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-md bg-slate-800 py-2.5 text-white transition-all hover:bg-slate-900"
        >
          <Search className="h-4 w-4" />
          <span>Batafsil tahlilni ko‘rish</span>
        </button>
      </div>
    </div>
  )
}

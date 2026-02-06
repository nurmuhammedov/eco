import { useState } from 'react'

import { Search } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
interface RiskCenterProps {
  data: any
}

const RiskSection = ({ title, count, items, bgClass, dotClass }: any) => (
  <div className="space-y-4">
    <div className={cn('flex items-center justify-between rounded-md p-3 text-white', bgClass)}>
      <span className="font-semibold">{title}</span>
      <span className="text-lg font-bold">{count}</span>
    </div>
    <div className="space-y-1">
      {items.map((item: any, idx: number) => (
        <div
          key={idx}
          className="flex cursor-pointer items-center justify-between rounded-md border border-transparent p-2 text-sm transition-colors hover:border-slate-100 hover:bg-slate-50"
        >
          <div className="flex items-center gap-3">
            <span className={cn('h-2.5 w-2.5 rounded-full', dotClass)}></span>
            <span className="leading-tight font-medium text-slate-700">{item.name}</span>
          </div>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-900">{item.count}</span>
        </div>
      ))}
    </div>
  </div>
)

export const RiskCenter = ({ data }: RiskCenterProps) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth() + 1
  const currentQuarter = Math.ceil(currentMonth / 3)

  let defaultYear = currentYear
  let defaultQuarter = currentQuarter - 1
  if (defaultQuarter === 0) {
    defaultQuarter = 4
    defaultYear = currentYear - 1
  }

  const [year, setYear] = useState(defaultYear.toString())
  const [quarter, setQuarter] = useState(defaultQuarter.toString())

  const years = Array.from({ length: 100 }, (_, i) => 2025 + i)
  const quarters = [1, 2, 3, 4]

  return (
    <div className="flex h-full flex-col rounded-lg border bg-white p-6 shadow-sm">
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

          <Select value={quarter} onValueChange={setQuarter}>
            <SelectTrigger className="h-8 w-auto border-slate-200 bg-slate-50 px-2 text-xs focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Chora" />
            </SelectTrigger>
            <SelectContent align="end">
              {quarters.map((q) => (
                <SelectItem key={q} value={q.toString()} className="text-xs">
                  {q}-chorak
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* High Risk */}
        <div className="space-y-4">
          <RiskSection
            title="Yuqori xavf"
            count={data.highRisk}
            items={data.highRiskList}
            bgClass="bg-red-500"
            dotClass="bg-red-500"
          />
        </div>

        {/* Medium Risk */}
        <div className="space-y-4">
          <RiskSection
            title="O‘rta xavf"
            count={data.mediumRisk}
            items={data.mediumRiskList}
            bgClass="bg-yellow-400"
            dotClass="bg-yellow-400"
          />
        </div>

        {/* Low Risk */}
        <div className="space-y-4">
          <RiskSection
            title="Past xavf"
            count={data.lowRisk}
            items={data.lowRiskList}
            bgClass="bg-emerald-500" // Using emerald/green for Low risk
            dotClass="bg-emerald-500"
          />
        </div>
      </div>

      <div className="mt-6 border-t border-slate-100 pt-4">
        <button className="flex w-full items-center justify-center space-x-2 rounded-md bg-slate-800 py-2.5 text-white transition-all hover:bg-slate-900">
          <Search className="h-4 w-4" />
          <span>Batafsil tahlilni ko‘rish</span>
        </button>
      </div>
    </div>
  )
}

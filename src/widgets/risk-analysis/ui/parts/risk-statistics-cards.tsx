import { useData } from '@/shared/hooks'
import { Layers, ShieldCheck, AlertTriangle, Flame } from 'lucide-react'
import clsx from 'clsx'

interface RiskStatisticsCardsProps {
  type: string
  activeRiskLevel: string
  onTabChange: (level: string) => void
  year: number | string
  quarter: string
  regionId?: string
}

interface RiskCountResponse {
  lowCount: number
  mediumCount: number
  highCount: number
}

export const RiskStatisticsCards = ({
  type,
  activeRiskLevel,
  onTabChange,
  year,
  quarter,
}: RiskStatisticsCardsProps) => {
  const { data, isLoading } = useData<RiskCountResponse>('/risk-analyses/count', true, {
    type,
    year,
    quarter,
  })

  const lowCount = data?.lowCount || 0
  const mediumCount = data?.mediumCount || 0
  const highCount = data?.highCount || 0
  const totalCount = lowCount + mediumCount + highCount

  const stats = [
    {
      id: 'ALL',
      name: 'Barchasi',
      count: totalCount,
      icon: Layers,
      // Active: Light Primary bg + Border
      activeClass: 'bg-[#0B626B]/10 border-[#0B626B] shadow-sm ring-1 ring-[#0B626B]',
      textClass: 'text-[#0B626B]',
      iconClass: 'bg-[#0B626B] text-white',
      // Inactive: White bg, Gray border
      inactiveClass: 'bg-white border-slate-200 hover:border-[#0B626B]/30 hover:bg-[#0B626B]/5',
      inactiveTextClass: 'text-slate-600',
      inactiveIconClass: 'bg-slate-100 text-slate-500 group-hover:bg-[#0B626B] group-hover:text-white',
    },
    {
      id: 'LOW',
      name: 'Xavfi past (0-60)',
      count: lowCount,
      icon: ShieldCheck,
      // Active: Light Emerald bg + Border
      activeClass: 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500',
      textClass: 'text-emerald-700',
      iconClass: 'bg-emerald-500 text-white',
      // Inactive
      inactiveClass: 'bg-white border-slate-200 hover:border-emerald-200 hover:bg-emerald-50',
      inactiveTextClass: 'text-slate-600',
      inactiveIconClass: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white',
    },
    {
      id: 'MEDIUM',
      name: 'Xavfi o‘rta (61-80)',
      count: mediumCount,
      icon: AlertTriangle,
      // Active
      activeClass: 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500',
      textClass: 'text-amber-700',
      iconClass: 'bg-amber-500 text-white',
      // Inactive
      inactiveClass: 'bg-white border-slate-200 hover:border-amber-200 hover:bg-amber-50',
      inactiveTextClass: 'text-slate-600',
      inactiveIconClass: 'bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    },
    {
      id: 'HIGH',
      name: 'Xavfi yuqori (81-100)',
      count: highCount,
      icon: Flame,
      // Active
      activeClass: 'bg-rose-50 border-rose-500 shadow-sm ring-1 ring-rose-500',
      textClass: 'text-rose-700',
      iconClass: 'bg-rose-500 text-white',
      // Inactive
      inactiveClass: 'bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50',
      inactiveTextClass: 'text-slate-600',
      inactiveIconClass: 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white',
    },
  ]

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const isActive = activeRiskLevel === stat.id

        return (
          <div
            key={stat.id}
            onClick={() => onTabChange(stat.id)}
            className={clsx(
              'group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border p-5 transition-all duration-300',
              isActive ? stat.activeClass : stat.inactiveClass
            )}
          >
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500">{stat.name}</span>
              <span
                className={clsx(
                  'text-2xl font-bold transition-colors',
                  isLoading && 'animate-pulse opacity-50',
                  isActive ? stat.textClass : 'text-slate-900'
                )}
              >
                {stat.count}
              </span>
            </div>

            <div
              className={clsx('rounded-lg p-3 transition-colors', isActive ? stat.iconClass : stat.inactiveIconClass)}
            >
              <stat.icon size={24} className="current-color" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

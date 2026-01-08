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
      inactiveClass: 'bg-[#016B7B]/10 border-[#016B7B]/20 text-[#016B7B]',
      activeClass: 'bg-[#016B7B] border-[#015a67] text-white shadow-sm',
    },
    {
      id: 'LOW',
      name: 'Xavfi past (0-60)',
      count: lowCount,
      icon: ShieldCheck,
      inactiveClass: 'bg-green-50 border-green-200 text-green-700',
      activeClass: 'bg-green-600 border-green-700 text-white shadow-sm',
    },
    {
      id: 'MEDIUM',
      name: 'Xavfi o‘rta (61-80)',
      count: mediumCount,
      icon: AlertTriangle,
      inactiveClass: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      activeClass: 'bg-yellow-600 border-yellow-700 text-white shadow-sm',
    },
    {
      id: 'HIGH',
      name: 'Xavfi yuqori (81-100)',
      count: highCount,
      icon: Flame,
      inactiveClass: 'bg-red-50 border-red-200 text-red-700',
      activeClass: 'bg-red-600 border-red-700 text-white shadow-sm',
    },
  ]

  return (
    <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const isActive = activeRiskLevel === stat.id

        return (
          <div
            key={stat.id}
            onClick={() => onTabChange(stat.id)}
            className={clsx(
              'relative flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors duration-200 select-none',
              isActive ? stat.activeClass : `${stat.inactiveClass} hover:opacity-80`
            )}
          >
            <div>
              <p className="mb-1 text-sm font-medium opacity-90">{stat.name}</p>
              <h3 className={clsx('text-2xl font-bold', isLoading && 'animate-pulse opacity-50')}>{stat.count}</h3>
            </div>

            <div
              className={clsx(
                'rounded-full p-2 transition-colors',
                isActive ? 'bg-white/20 text-white' : 'bg-white/60'
              )}
            >
              <stat.icon size={24} className="currentColor" />
            </div>
          </div>
        )
      })}
    </div>
  )
}

import { useSearchParams } from 'react-router-dom'

import { StatsCards } from './stats-cards'
import { RiskCenter } from './risk-center'
import { ActionCenter } from './action-center'

import { DocumentsStats } from './documents-stats'
import { InquiriesStats } from './inquiries-stats'
import { cn } from '@/shared/lib/utils'
import { useDashboardStats } from '../model/use-dashboard-stats'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'

export const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const currentTab = (searchParams.get('tab') as 'hf' | 'equipment' | 'irs' | 'xray') || 'hf'

  // Get regionId from URL
  const regionIdParam = searchParams.get('regionId')
  let activeRegionId = regionIdParam ? parseInt(regionIdParam) : null

  if (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) {
    activeRegionId = user?.regionId || activeRegionId
  }

  const stats = useDashboardStats(activeRegionId?.toString(), currentTab)

  const handleTabChange = (val: string) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev)
      newParams.set('tab', val)
      return newParams
    })
  }

  const getStatsData = () => {
    return (stats as any)[currentTab] || stats.hf
  }

  const tabs = [
    { id: 'hf', label: 'XICHO' },
    { id: 'equipment', label: 'Qurilmalar' },
    { id: 'irs', label: 'INM' },
    { id: 'xray', label: 'Rentgenlar' },
  ]

  const regionParam = activeRegionId?.toString()

  return (
    <div className="w-full pb-4">
      <div className="w-full space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Horizontal scroll keeps all four tabs reachable on a narrow screen. */}
        <div className="scrollbar-hidden -mx-1 min-w-0 overflow-x-auto px-1">
          <div className="inline-flex min-w-max items-center rounded-lg bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'focus-visible:ring-teal cursor-pointer rounded-md px-6 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-hidden',
                  currentTab === tab.id
                    ? 'bg-teal text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <StatsCards type={currentTab} data={getStatsData()} regionId={regionParam} />

        <ActionCenter regionId={regionParam} />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <InquiriesStats regionId={regionParam} />
          <RiskCenter regionId={regionParam} />
        </div>

        <DocumentsStats />
      </div>
    </div>
  )
}

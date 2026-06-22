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

  return (
    <div className="w-full bg-slate-50/50 pb-4">
      <div className="w-full rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-6 flex flex-col justify-start gap-4 md:flex-row md:items-center">
          <div className="scrollbar-hidden min-w-0 overflow-x-auto">
            <div className="inline-flex min-w-max items-center rounded-lg bg-slate-100 p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'cursor-pointer rounded-md px-6 py-2 text-sm font-medium transition-all duration-200',
                    currentTab === tab.id
                      ? 'bg-[#0B626B] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <StatsCards type={currentTab} data={getStatsData()} regionId={activeRegionId?.toString()} />

        <div className="mb-4">
          <ActionCenter regionId={activeRegionId?.toString()} />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-12 xl:col-span-6">
            <InquiriesStats regionId={activeRegionId?.toString()} />
          </div>

          <div className="lg:col-span-12 xl:col-span-6">
            <RiskCenter regionId={activeRegionId?.toString()} />
          </div>
        </div>

        <DocumentsStats />
      </div>
    </div>
  )
}

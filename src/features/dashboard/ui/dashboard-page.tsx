import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { StatsCards } from './stats-cards'
import { RiskCenter } from './risk-center'
import { ActionCenter } from './action-center'
import { UzbekistanMap } from '@/features/dashboard/ui/uzbekistan-map'
import { DocumentsStats } from './documents-stats'
import { InquiriesStats } from './inquiries-stats'
import { cn } from '@/shared/lib/utils'
import { useDashboardStats } from '../model/use-dashboard-stats'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { getRegionIdByName } from '../model/constants'

export const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()
  const currentTab = (searchParams.get('tab') as 'hf' | 'equipment' | 'irs' | 'xray') || 'hf'
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  // Convert activeRegion name to ID for API calls
  const activeRegionId = activeRegion ? getRegionIdByName(activeRegion)?.toString() : null

  const stats = useDashboardStats(activeRegionId)

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val })
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

  const isChairman = user?.role === UserRoles.CHAIRMAN

  return (
    <div className="w-full bg-slate-50/50 pb-4">
      <div className="w-full rounded-xl border bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 flex items-center gap-3 text-2xl font-bold text-slate-900">
              Asosiy maʼlumotlar
              <span className="text-base font-normal text-amber-600 italic">
                (ushbu sahifa ishlab chiqish jarayonida)
              </span>
            </h1>
          </div>

          <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
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

        <StatsCards type={currentTab} data={getStatsData()} />

        <div className="mb-4">
          <ActionCenter />
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-12 xl:col-span-6">
            <InquiriesStats />
          </div>

          <div className="lg:col-span-12 xl:col-span-6">
            <RiskCenter regionId={activeRegionId} />
          </div>
        </div>

        <DocumentsStats />

        {isChairman && (
          <div className="mt-8 mb-8 flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between px-2">
              <h3 className="text-lg font-semibold text-slate-800">{activeRegion || 'Viloyatlar kesimida'}</h3>
              <div className="flex gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-[#0B626B]"></span> Tanlangan
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-slate-200"></span> Hududlar
                </div>
              </div>
            </div>
            <div className="mx-auto w-full max-w-5xl">
              <UzbekistanMap
                className="w-full flex-1"
                activeRegionId={activeRegion}
                onRegionClick={(name) => setActiveRegion((prev) => (prev === name ? null : name))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

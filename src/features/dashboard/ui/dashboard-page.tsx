import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { StatsCards } from './stats-cards'
import { RiskCenter } from './risk-center'
import { ActionCenter } from './action-center'
import { UzbekistanMap } from '@/features/dashboard/ui/uzbekistan-map'
import { DocumentsStats } from './documents-stats'
import { InquiriesStats } from './inquiries-stats'
import { cn } from '@/shared/lib/utils'
import { TABS_STATS, RISK_ANALYSIS_STATS } from '../model/mock-data'

export const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentTab = (searchParams.get('tab') as 'hf' | 'equipment' | 'irs' | 'xray') || 'hf'
  const [activeRegion, setActiveRegion] = useState<string | null>(null)

  const handleTabChange = (val: string) => {
    setSearchParams({ tab: val })
  }

  const getStatsData = () => {
    return TABS_STATS[currentTab] || TABS_STATS.hf
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
        <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-slate-900">Asosiy maʼlumotlar</h1>
          </div>

          <div className="inline-flex items-center rounded-lg bg-slate-100 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  'rounded-md px-6 py-2 text-sm font-medium transition-all duration-200',
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
          <div className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 lg:col-span-6">
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
            <UzbekistanMap
              className="w-full flex-1"
              activeRegionId={activeRegion}
              onRegionClick={(id) => setActiveRegion(id)}
            />
          </div>

          <div className="lg:col-span-6">
            <RiskCenter data={RISK_ANALYSIS_STATS} />
          </div>
        </div>

        <DocumentsStats />
        <InquiriesStats />
      </div>
    </div>
  )
}

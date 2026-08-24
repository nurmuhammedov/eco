import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { useDashboardStats } from '../model/use-dashboard-stats'
import { ActionCenter } from './action-center'
import { DocumentsStats } from './documents-stats'
import { InquiriesStats } from './inquiries-stats'
import { RiskCenter } from './risk-center'
import { StatsCards } from './stats-cards'

type RegistryTab = 'hf' | 'equipment' | 'irs' | 'xray'

const TABS: { id: RegistryTab; label: string }[] = [
  { id: 'hf', label: 'XICHO' },
  { id: 'equipment', label: 'Qurilmalar' },
  { id: 'irs', label: 'INM' },
  { id: 'xray', label: 'Rentgenlar' },
]

export const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const currentTab = (searchParams.get('tab') as RegistryTab) || 'hf'

  const regionIdParam = searchParams.get('regionId')
  let activeRegionId = regionIdParam ? parseInt(regionIdParam) : null

  if (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) {
    activeRegionId = user?.regionId || activeRegionId
  }

  const regionParam = activeRegionId?.toString()
  const stats = useDashboardStats(regionParam, currentTab)

  const handleTabChange = (value: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', value)

      return next
    })
  }

  return (
    <div className="w-full pb-4">
      <div className="w-full space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          /**
           * Each tab loads its own counts, so automatic activation would fire a
           * request batch for every tab an arrow key passes over.
           */
          activationMode="manual"
          className="space-y-4"
        >
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-lg bg-slate-100 p-1 md:w-fit">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-1 rounded-md px-6 py-2 font-medium text-slate-600 md:flex-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <StatsCards type={tab.id} data={stats[tab.id]} regionId={regionParam} />
            </TabsContent>
          ))}
        </Tabs>

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

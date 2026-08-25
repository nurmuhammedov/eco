import { useSearchParams } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { useDashboardStats } from '../model/use-dashboard-stats'
import { ActionCenter } from './action-center'
import { DocumentsStats } from './documents-stats'
import { InquiriesStats } from './inquiries-stats'
import { RiskCenter } from './risk-center'
import { StatsCards } from './stats-cards'
import { FacilitiesMap } from './facilities-map'

type RegistryTab = 'hf' | 'equipment' | 'irs' | 'xray'
type DashboardTab = RegistryTab | 'map'

const REGISTRY_TABS: { id: RegistryTab; label: string }[] = [
  { id: 'hf', label: 'XICHO' },
  { id: 'equipment', label: 'Qurilmalar' },
  { id: 'irs', label: 'INM' },
  { id: 'xray', label: 'Rentgenlar' },
]

const TABS: { id: DashboardTab; label: string }[] = [...REGISTRY_TABS, { id: 'map', label: 'Karta' }]

export const DashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuth()

  const currentTab = (searchParams.get('tab') as DashboardTab) || 'hf'
  const isMapTab = currentTab === 'map'
  // The map has no counts of its own; the registry queries stay on their last tab.
  const statsTab: RegistryTab = currentTab === 'map' ? 'hf' : currentTab

  const regionIdParam = searchParams.get('regionId')
  let activeRegionId = regionIdParam ? parseInt(regionIdParam) : null

  if (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) {
    activeRegionId = user?.regionId || activeRegionId
  }

  const regionParam = activeRegionId?.toString()
  const stats = useDashboardStats(regionParam, statsTab)

  const handleTabChange = (value: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous)
      next.set('tab', value)

      return next
    })
  }

  return (
    // On the map tab the column stretches so the map can take whatever height is
    // left, rather than guessing at it with a fixed offset.
    <div className={cn('w-full', isMapTab ? 'flex h-full flex-col pb-1' : 'pb-4')}>
      <div
        className={cn(
          'w-full space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
          isMapTab && 'flex min-h-0 flex-1 flex-col'
        )}
      >
        <Tabs
          value={currentTab}
          onValueChange={handleTabChange}
          /**
           * Each tab loads its own counts, so automatic activation would fire a
           * request batch for every tab an arrow key passes over.
           */
          activationMode="manual"
          className={cn('space-y-4', isMapTab && 'flex min-h-0 flex-1 flex-col')}
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

          {REGISTRY_TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <StatsCards type={tab.id} data={stats[tab.id]} regionId={regionParam} />
            </TabsContent>
          ))}

          {/* Manual activation keeps the map from loading until the tab is opened. */}
          <TabsContent value="map" className="mt-0 min-h-0 flex-1">
            <FacilitiesMap />
          </TabsContent>
        </Tabs>

        {/* The map is the whole view when it is open; the summaries below would
            push it into a strip and keep loading counts nobody is reading. */}
        {!isMapTab && (
          <>
            <ActionCenter regionId={regionParam} />

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <InquiriesStats regionId={regionParam} />
              <RiskCenter regionId={regionParam} />
            </div>

            <DocumentsStats />
          </>
        )}
      </div>
    </div>
  )
}

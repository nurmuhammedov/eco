import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { useRegionSelectQuery } from '@/shared/api/dictionaries'
import type { PreventionCount } from '@/features/prevention/model/types'
import { UserRoles } from '@/shared/types/user'
import { PreventionTable } from '@/features/prevention'
import { TabsLayout } from '@/shared/layouts'
import { useMemo } from 'react'
import { cn } from '@/shared/lib/utils'
import PreventionCards from '@/widgets/prevention/ui/parts/prevention-cards'
import { getCurrentMonthEnum } from '@/shared/constants/months'
import { paramText } from '@/shared/lib/url-params'

export const getRegionLabel = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('toshkent viloyati')) return 'Toshkent v.'
  if (lowerName.includes('toshkent shahri')) return 'Toshkent sh.'
  return name.split(' ')[0]
}

/** The prevention tabs and the figure of `/preventions/count` each one shows */
const RISK_TYPES: { value: string; label: string; countKey: keyof PreventionCount }[] = [
  { value: 'HF', label: 'XICHO', countKey: 'hfCount' },
  { value: 'IRS', label: 'INM', countKey: 'irsCount' },
  { value: 'XRAY', label: 'Rentgen', countKey: 'xrayCount' },
  { value: 'ATTRACTION', label: 'Attraksion', countKey: 'attractionCount' },
]

const ASSIGNMENT_STATUSES = [
  { value: 'ALL', label: 'Barchasi' },
  { value: 'UNASSIGNED', label: 'Inspektor belgilanmaganlar' },
  { value: 'ASSIGNED', label: 'Inspektor belgilanganlar' },
]

const PreventionWidget = () => {
  const { user } = useAuth()
  const { paramsObject, addParams } = useCustomSearchParams()
  const activeMonth = paramText(paramsObject.month, getCurrentMonthEnum())
  const activeType = paramText(paramsObject.belongType, 'HF')
  const year = paramText(paramsObject.year, String(new Date().getFullYear()))

  const isRegional = user?.role === UserRoles.REGIONAL
  const isInspector = user?.role === UserRoles.INSPECTOR

  const { data = [] } = useRegionSelectQuery(!isInspector && !isRegional)
  const { data: counts } = useData<PreventionCount>('/preventions/count', !!year && !!activeMonth, {
    year,
    month: activeMonth,
  })

  const { executorId, registryNumber, name, ownerName, identity, address } = paramsObject

  const assigned =
    paramsObject.assignment === 'ASSIGNED' ? true : paramsObject.assignment === 'UNASSIGNED' ? false : undefined

  const { data: regionCounts = [] } = useData<{ regionId: number; count: number }[]>(
    '/preventions/count/by-region',
    !!year && !!activeMonth,
    {
      year,
      month: activeMonth,
      belongType: activeType,
      executorId,
      registryNumber,
      name,
      ownerName,
      identity,
      address,
      assigned,
    }
  )

  const activeRegion = paramsObject.regionId?.toString() || (data && data.length > 0 ? data[0].id?.toString() : '')
  const activeAssignment = paramText(paramsObject.assignment, isInspector ? 'ASSIGNED' : 'ALL')

  const regionTabs = useMemo(() => {
    return (
      data?.map((item) => {
        const countItem = regionCounts.find((c) => c.regionId === item.id)
        return {
          id: item?.id?.toString(),
          name: item.name || '',
          count: countItem?.count || 0,
        }
      }) || []
    )
  }, [data, regionCounts])

  const riskTypes = useMemo(() => {
    return RISK_TYPES.map((item) => ({
      value: item.value,
      label: item.label,
      count: counts?.[item.countKey] || 0,
    }))
  }, [counts])

  return (
    <>
      <div className="mb-2 flex w-full flex-col gap-2">
        <PreventionCards
          year={year}
          type={activeType}
          activeRiskLevel={activeMonth}
          onTabChange={(val) => addParams({ month: val, page: 1 })}
        />

        <Tabs value={activeType} onValueChange={(val) => addParams({ belongType: val, page: 1 })}>
          <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
            <TabsList className="h-auto p-1">
              {riskTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                  <Badge
                    variant="destructive"
                    className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
                  >
                    {type?.count || 0}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        {regionTabs.length > 0 && !isRegional && !isInspector ? (
          <TabsLayout
            // classNameTabList="!mb-0 min-w-full"
            // classNameWrapper="w-full"
            // classNameTrigger="flex-1"
            tabs={regionTabs}
            activeTab={activeRegion}
            onTabChange={(val) => addParams({ regionId: val, page: 1 })}
            outlineInactiveCount={true}
            showArrows={true}
          />
        ) : null}

        {!isInspector && !(isRegional && (activeType === 'IRS' || activeType === 'XRAY')) && (
          <Tabs value={activeAssignment} onValueChange={(val) => addParams({ assignment: val, page: 1 })}>
            <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
              <TabsList className="h-auto p-1">
                {ASSIGNMENT_STATUSES.map((status) => (
                  <TabsTrigger key={status.value} value={status.value}>
                    {status.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        )}
      </div>
      <PreventionTable regions={data || []} />
    </>
  )
}

export default PreventionWidget

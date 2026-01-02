import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { PreventionTable } from '@/features/prevention'
import { TabsLayout } from '@/shared/layouts'
import { useMemo } from 'react'
import { cn } from '@/shared/lib/utils'
import PreventionCards from '@/widgets/prevention/ui/parts/prevention-cards'

export const getCurrentMonthEnum = () => {
  const monthNames = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ]
  return monthNames[new Date().getMonth()]
}

export const getRegionLabel = (name: string) => {
  const lowerName = name.toLowerCase()
  if (lowerName.includes('toshkent viloyati')) return 'Toshkent v.'
  if (lowerName.includes('toshkent shahri')) return 'Toshkent sh.'
  return name.split(' ')[0]
}

export const MONTHS = [
  { value: 'JANUARY', label: 'Yanvar', count: 0 },
  { value: 'FEBRUARY', label: 'Fevral', count: 0 },
  { value: 'MARCH', label: 'Mart', count: 0 },
  { value: 'APRIL', label: 'Aprel', count: 0 },
  { value: 'MAY', label: 'May', count: 0 },
  { value: 'JUNE', label: 'Iyun', count: 0 },
  { value: 'JULY', label: 'Iyul', count: 0 },
  { value: 'AUGUST', label: 'Avgust', count: 0 },
  { value: 'SEPTEMBER', label: 'Sentabr', count: 0 },
  { value: 'OCTOBER', label: 'Oktabr', count: 0 },
  { value: 'NOVEMBER', label: 'Noyabr', count: 0 },
  { value: 'DECEMBER', label: 'Dekabr', count: 0 },
]

const RISK_TYPES = [
  { value: 'HF', label: 'XICHO' },
  { value: 'IRS', label: 'INM' },
  { value: 'ELEVATOR', label: 'Lift' },
  { value: 'ATTRACTION', label: 'Attraksion' },
  { value: 'XRAY', label: 'Rentgen' },
  { value: 'LPG_POWERED', label: 'Yiliga 100 ming va undan ortiq kubometr tabiiy gazdan foydalanuvchi qurilma' },
]

const ASSIGNMENT_STATUSES = [
  { value: 'ALL', label: 'Barchasi' },
  { value: 'UNASSIGNED', label: 'Inspektor belgilanmaganlar' },
  { value: 'ASSIGNED', label: 'Inspektor belgilanganlar' },
]

const PreventionWidget = () => {
  const { user } = useAuth()
  const { paramsObject, addParams } = useCustomSearchParams()
  const activeMonth = paramsObject.month || getCurrentMonthEnum()
  const activeType = paramsObject.belongType || 'HF'
  const year = paramsObject.year || new Date().getFullYear()

  const isRegional = user?.role === UserRoles.REGIONAL
  const isInspector = user?.role === UserRoles.INSPECTOR

  const { data = [] } = useData<{ id: number; name: string }[]>('/regions/select', !isInspector && !isRegional)
  const { data: counts = {} } = useData<any>('/preventions/count', !!year && !!activeMonth, {
    year,
    month: activeMonth,
  })

  const activeRegion = paramsObject.regionId?.toString() || (data && data.length > 0 ? data[0].id?.toString() : '')
  const activeAssignment = paramsObject.assignment || (isInspector ? 'ASSIGNED' : 'ALL')

  const regionTabs = useMemo(() => {
    return (
      data?.map((item) => ({
        id: item?.id?.toString(),
        name: getRegionLabel(item.name || ''),
      })) || []
    )
  }, [data])

  const riskTypes = useMemo(() => {
    return (
      RISK_TYPES?.map((item) => ({
        value: item?.value,
        label: item.label,
        count:
          item.value == 'LPG_POWERED'
            ? counts?.lpgPoweredCount || 0
            : counts?.[`${item.value?.toString()?.toLowerCase()}Count`] || 0,
      })) || []
    )
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
            classNameTabList="!mb-0 w-full"
            classNameWrapper="w-full"
            classNameTrigger="flex-1"
            tabs={regionTabs}
            activeTab={activeRegion}
            onTabChange={(val) => addParams({ regionId: val, page: 1 })}
          />
        ) : null}

        {!isInspector && (
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

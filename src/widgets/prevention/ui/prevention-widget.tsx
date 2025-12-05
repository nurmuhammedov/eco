import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import Table from '@/features/prevention/ui/table'
import { TabsLayout } from '@/shared/layouts'
import clsx from 'clsx'
import { useMemo } from 'react'
import { cn } from '@/shared/lib/utils'

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

const getRegionLabel = (name: string) => {
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

interface RiskStatisticsCardsProps {
  activeRiskLevel: string
  year?: any
  type?: any
  onTabChange: (level: string) => void
}

export const Cards = ({ activeRiskLevel, onTabChange, year, type }: RiskStatisticsCardsProps) => {
  const { data: monthCount = {} } = useData<any>('/preventions/count/by-month', !!year && !!type, {
    year,
    type,
  })

  const stats = MONTHS.map((month) => {
    const key = `${month.value.toLowerCase()}Count`

    return {
      id: month.value,
      name: month.label,
      year: year,
      count: monthCount?.[key] || '0',
      inactiveClass: 'bg-[#016B7B]/10 border-[#016B7B]/20 text-[#016B7B]',
      activeClass: 'bg-[#016B7B] border-[#015a67] text-white shadow-sm',
    }
  })

  return (
    <div className="scrollbar-hidden flex w-full gap-2 overflow-x-auto">
      {stats.map((stat) => {
        const isActive = activeRiskLevel === stat.id

        return (
          <div
            key={stat.id}
            onClick={() => onTabChange(stat.id)}
            className={clsx(
              'relative flex flex-1 cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors duration-200 select-none',
              isActive ? stat.activeClass : `${stat.inactiveClass} hover:opacity-80`
            )}
          >
            <div className="w-full">
              <div className="flex w-full justify-between gap-2">
                <p className="mb-1 text-sm font-medium opacity-90">{stat.name}</p>
                <p className="mb-1 text-sm font-medium opacity-90">{stat?.year}</p>
              </div>
              <h3 className={clsx('text-2xl font-bold')}>{stat.count}</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}

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
          counts?.[`${item.value == 'LPG_POWERED' ? 'lpgPoweredCount' : item.value?.toString()?.toLowerCase()}Count`] ||
          0,
      })) || []
    )
  }, [counts])

  return (
    <>
      <div className="mb-2 flex w-full flex-col gap-2">
        <Cards
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

      <Table regions={data || []} />
    </>
  )
}

export default PreventionWidget

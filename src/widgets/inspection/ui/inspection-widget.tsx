import { InspectionList } from '@/features/inspections/ui/inspection-list'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useAuth } from '@/shared/hooks/use-auth'
import React, { useMemo } from 'react'
import { UserRoles } from '@/entities/user'
import { useData } from '@/shared/hooks'
import { Badge } from '@/shared/components/ui/badge'
import clsx from 'clsx'
import { cn } from '@/shared/lib/utils'
import { getRegionLabel } from '@/widgets/prevention/ui/prevention-widget'

export enum InspectionStatus {
  ALL = 'ALL',
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
}

export enum InspectionSubMenuStatus {
  CONDUCTED = 'CONDUCTED',
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
}

export interface CountDto {
  allCount: number
  newCount: number
  assignedCount: number
  conductedCount: number
}

export const defaultCountDto: CountDto = {
  allCount: 0,
  newCount: 0,
  assignedCount: 0,
  conductedCount: 0,
}

const Cards = ({ onTabChange, regionId }: any) => {
  const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select')

  const activeRegion = regionId?.toString() || (regions && regions.length > 0 ? regions[0].id?.toString() : '')

  const regionTabs = useMemo(() => {
    return (
      regions?.map((item) => ({
        id: item?.id?.toString(),
        name: getRegionLabel(item.name || ''),
        count: 0,
      })) || []
    )
  }, [regions])

  const stats = regionTabs?.map((month) => ({
    id: month?.id,
    name: month?.name,
    count: month?.count || 0,
    inactiveClass: 'bg-[#016B7B]/10 border-[#016B7B]/20 text-[#016B7B]',
    activeClass: 'bg-[#016B7B] border-[#015a67] text-white shadow-sm',
  }))

  return (
    <div className="scrollbar-hidden mb-2 flex w-full gap-2 overflow-x-auto">
      {stats.map((stat) => {
        const isActive = activeRegion === stat.id

        return (
          <div
            key={stat.id}
            onClick={() => onTabChange(stat.id)}
            className={clsx(
              'relative flex min-w-fit flex-1 shrink grow cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors duration-200 select-none',
              isActive ? stat.activeClass : `${stat.inactiveClass} hover:opacity-80`
            )}
          >
            <div className="w-full">
              <div className="flex w-full justify-between gap-2">
                <p className="mb-1 text-sm font-medium whitespace-nowrap opacity-90">{stat.name}</p>
              </div>
              <h3 className="text-2xl font-bold">{stat.count}</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export const InspectionWidget: React.FC = () => {
  const { user } = useAuth()
  const { paramsObject, addParams } = useCustomSearchParams()
  const isInspector = user?.role == UserRoles.INSPECTOR
  const isLegal = user?.role == UserRoles.LEGAL
  const activeTab = paramsObject.status
  const activeSubTab = paramsObject.subStatus
  const activeProcess = paramsObject.process
  const regionId = paramsObject.regionId
  // const year = paramsObject.year || new Date().getFullYear()
  // const month = paramsObject.month || getCurrentMonthEnum()

  const { data: countObject = defaultCountDto } = useData<CountDto>('/inspections/count')

  const handleTabChange = (value: string) => {
    addParams({ status: value, page: 1 })
  }

  const handleSubTabChange = (value: string) => {
    addParams({ subStatus: value, page: 1 })
  }

  if (isInspector || isLegal) {
    return (
      <>
        <Cards regionId={regionId} onTabChange={(val: string) => addParams({ regionId: val, page: 1 })} />

        <Tabs value={activeSubTab || InspectionSubMenuStatus.ASSIGNED} onValueChange={handleSubTabChange}>
          <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
            <TabsList>
              <TabsTrigger value={InspectionSubMenuStatus.ASSIGNED}>
                Tekshiruv o‘tkazilmagan
                <Badge variant="destructive" className="ml-2">
                  {countObject.assignedCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value={InspectionSubMenuStatus.CONDUCTED}>
                Tekshiruv o‘tkazilgan
                <Badge variant="destructive" className="ml-2">
                  {countObject.conductedCount || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={InspectionSubMenuStatus.CONDUCTED}>
            <InspectionList />
          </TabsContent>
          <TabsContent value={InspectionSubMenuStatus.ASSIGNED}>
            <InspectionList />
          </TabsContent>
        </Tabs>
      </>
    )
  }

  return (
    <>
      <Cards regionId={regionId} onTabChange={(val: string) => addParams({ regionId: val, page: 1 })} />
      <Tabs value={activeTab || InspectionStatus.ALL} onValueChange={handleTabChange}>
        <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
          <TabsList>
            <TabsTrigger value={InspectionStatus.ALL}>
              Barchasi
              <Badge variant="destructive" className="ml-2">
                {countObject.allCount || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={InspectionStatus.NEW}>
              Inspektor belgilanmaganlar
              <Badge variant="destructive" className="ml-2">
                {countObject.newCount || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={InspectionStatus.ASSIGNED}>
              Inspektor belgilanganlar
              <Badge variant="destructive" className="ml-2">
                {(countObject.assignedCount || 0) + (countObject.conductedCount || 0)}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value={InspectionStatus.ALL}>
          <InspectionList />
        </TabsContent>
        <TabsContent value={InspectionStatus.NEW}>
          <InspectionList />
        </TabsContent>
        <TabsContent value={InspectionStatus.ASSIGNED}>
          <div className="mb-3">
            <Tabs
              value={activeSubTab || InspectionSubMenuStatus.ASSIGNED}
              onValueChange={(value) => {
                addParams({ subStatus: value, page: 1 })
              }}
            >
              <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
                <TabsList>
                  <TabsTrigger value={InspectionSubMenuStatus.ASSIGNED}>
                    Tekshiruv o‘tkazilmagan
                    <Badge variant="destructive" className="ml-2">
                      {countObject.assignedCount || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value={InspectionSubMenuStatus.CONDUCTED}>
                    Tekshiruv o‘tkazilgan
                    <Badge variant="destructive" className="ml-2">
                      {countObject.conductedCount || 0}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>
          {activeSubTab == InspectionSubMenuStatus.CONDUCTED ? (
            <div className="mb-3">
              <Tabs
                value={activeProcess || 'IN_PROCESS'}
                onValueChange={(value) => {
                  addParams({ process: value, page: 1 })
                }}
              >
                <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
                  <TabsList>
                    <TabsTrigger value="IN_PROCESS">
                      Jarayonda
                      <Badge variant="destructive" className="ml-2">
                        0
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="FINISHED">
                      Yakunlangan
                      <Badge variant="destructive" className="ml-2">
                        0
                      </Badge>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </Tabs>
            </div>
          ) : null}
          <InspectionList />
        </TabsContent>
      </Tabs>
    </>
  )
}

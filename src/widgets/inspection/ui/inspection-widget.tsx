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
import { getQuarter } from 'date-fns'

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

interface RegionCountDto {
  count: number
  region: string
  regionId: number
}

const Cards = ({ onTabChange, regionId, year, quarter }: any) => {
  const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select')
  const { data: regionCounts = [] } = useData<RegionCountDto[]>('/inspections/count/by-region', true, { year, quarter })

  const activeRegion = regionId?.toString() || (regions && regions.length > 0 ? regions[0].id?.toString() : '')

  const regionTabs = useMemo(() => {
    return (
      regions?.map((item) => {
        const countItem = regionCounts.find((c) => c.regionId === item.id)
        return {
          id: item?.id?.toString(),
          name: getRegionLabel(item.name || ''),
          count: countItem?.count || 0,
        }
      }) || []
    )
  }, [regions, regionCounts])

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

  const isInspector = user?.role === UserRoles.INSPECTOR
  const isLegal = user?.role === UserRoles.LEGAL
  const isRegional = user?.role === UserRoles.REGIONAL

  const activeTab = paramsObject.status
  const activeSubTab = paramsObject.subStatus
  const regionId = paramsObject.regionId

  const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select')

  const activeRegion = regionId?.toString() || (regions && regions.length > 0 ? regions[0].id?.toString() : '')

  const { data: countObject = defaultCountDto } = useData<CountDto>('/inspections/count', true, {
    year: paramsObject?.year || new Date().getFullYear(),
    quarter: paramsObject?.quarter || getQuarter(new Date()).toString(),
    regionId: paramsObject?.regionId || activeRegion,
    status: paramsObject?.status === 'ALL' ? '' : paramsObject?.status || '',
    legalName: paramsObject?.legalName || '',
    legalTin: paramsObject?.legalTin || '',
    legalRegionId: paramsObject?.legalRegionId || '',
    legalDistrictId: paramsObject?.legalDistrictId || '',
    legalAddress: paramsObject?.legalAddress || '',
  })

  const handleTabChange = (value: string) => {
    addParams({ status: value, page: 1 })
  }

  const handleSubTabChange = (value: string) => {
    addParams({ subStatus: value, page: 1 })
  }

  if (isInspector || isLegal) {
    return (
      <>
        {!isInspector && (
          <Cards
            year={paramsObject?.year ? paramsObject?.year : new Date().getFullYear()}
            quarter={paramsObject?.quarter ? paramsObject?.quarter : getQuarter(new Date()).toString()}
            regionId={regionId}
            onTabChange={(val: string) => addParams({ regionId: val }, 'page', 'legalDistrictId')}
          />
        )}

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
    <div>
      {!isRegional && (
        <Cards
          year={paramsObject?.year ? paramsObject?.year : new Date().getFullYear()}
          quarter={paramsObject?.quarter ? paramsObject?.quarter : getQuarter(new Date()).toString()}
          regionId={regionId}
          onTabChange={(val: string) => addParams({ regionId: val }, 'page', 'legalDistrictId')}
        />
      )}
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
          <InspectionList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

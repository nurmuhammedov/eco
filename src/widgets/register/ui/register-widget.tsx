import { UserRoles } from '@/entities/user'
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list'
import { HfList } from '@/features/register/hf/ui/hf-list'
import { IrsList } from '@/features/register/irs/ui/irs-list'
import { XrayList } from '@/features/register/xray/ui/xray-list'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/use-auth'
import React, { useState } from 'react'
import { RegisterActiveTab } from '../types'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { format } from 'date-fns'
import { cn } from '@/shared/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { useDistrictSelectQueries } from '@/shared/api/dictionaries'

const RegisterWidget = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user } = useAuth()
  const {
    paramsObject: {
      mode = '',
      status = 'ALL',
      tab = user?.role != UserRoles.INDIVIDUAL ? RegisterActiveTab.HF : RegisterActiveTab.EQUIPMENTS,
      type = tab == RegisterActiveTab.EQUIPMENTS ? 'ALL' : '',
      regionId = (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
        ? user.regionId.toString()
        : 'ALL',
      districtId = '',
      ...rest
    },
    addParams,
    removeParams,
  } = useCustomSearchParams()

  const { data: hfCount = 0 } = useData<number>('/hf/count', user?.role != UserRoles.INDIVIDUAL, {
    mode,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId,
  })
  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count', true, {
    mode,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId,
  })
  const { data: irsCount = 0 } = useData<number>('/irs/count', user?.role != UserRoles.INDIVIDUAL, {
    mode,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId,
  })
  const { data: xrayCount = 0 } = useData<number>('/xrays/count', user?.role != UserRoles.INDIVIDUAL, {
    mode,
    regionId: regionId === 'ALL' ? '' : regionId,
    districtId,
  })

  const { data: regionOptions, isLoading: isLoadingRegions } = useData<any>(`${API_ENDPOINTS.REGIONS_SELECT}`)
  const { data: districts, isLoading: isDistrictsLoading } = useDistrictSelectQueries(regionId)

  const handleDownloadExel = () => {
    setIsLoading(true)
    apiClient
      .downloadFile<Blob>(`/${tab === 'equipments' && type === 'TANKERS' ? 'tankers' : tab}/export/excel`, {
        mode,
        status: status === 'ALL' ? '' : status,
        type: type === 'TANKERS' ? '' : type,
        regionId: regionId === 'ALL' ? '' : regionId,
        districtId,
        ...rest,
      })
      .then((res) => {
        const blob = res.data
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        const today = new Date()
        const filename = `Reyestrlar (${format(today, 'dd.MM.yyyy')}).xlsx`
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs
        className="flex flex-1 flex-col overflow-hidden"
        value={tab}
        onValueChange={(tab: string) =>
          addParams(
            { tab: tab.toString() },
            'page',
            'type',
            'status',
            'active',
            'childEquipmentId',
            'activityType',
            'changeStatus'
          )
        }
      >
        <div className={'flex flex-col gap-4 xl:flex-row-reverse xl:items-center xl:justify-between'}>
          <div className="flex flex-col gap-4 xl:flex-1 xl:flex-row xl:items-center xl:justify-end">
            <div className="flex w-full flex-col gap-2 p-0.5 sm:flex-row sm:items-center xl:w-auto">
              <Select
                onValueChange={(value) => {
                  if (value && value !== 'ALL') {
                    addParams({ mode: value }, 'page')
                  } else {
                    removeParams('mode')
                  }
                }}
                value={mode || ''}
              >
                <SelectTrigger className="w-full sm:w-fit sm:min-w-40 xl:w-fit xl:min-w-[200px]">
                  <SelectValue placeholder="Rasmiylashtirish turi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Barchasi</SelectItem>
                  {getSelectOptions([
                    { id: 'OFFICIAL', name: 'Arizachilar tomonidan ro‘yxatga olingan' },
                    {
                      id: 'UNOFFICIAL',
                      name: 'Qo‘mita tomonidan ro‘yxatga olingan',
                    },
                  ])}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => {
                  if (value) {
                    addParams({ regionId: value }, 'page', 'districtId')
                  } else {
                    removeParams('regionId', 'districtId')
                  }
                }}
                value={regionId?.toString()}
                disabled={isLoadingRegions}
              >
                <SelectTrigger className="w-full sm:w-fit sm:min-w-32 xl:w-fit xl:min-w-[120px]">
                  <SelectValue placeholder="Hudud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Barchasi</SelectItem>
                  {getSelectOptions(regionOptions)}
                </SelectContent>
              </Select>
              <Select
                onValueChange={(value) => {
                  if (value && value !== 'ALL') {
                    addParams({ districtId: value }, 'page')
                  } else {
                    removeParams('districtId')
                  }
                }}
                value={districtId?.toString()}
                disabled={isDistrictsLoading}
              >
                <SelectTrigger className="w-full sm:w-fit sm:min-w-32 xl:w-fit xl:min-w-[120px]">
                  <SelectValue placeholder="Tuman" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Barchasi</SelectItem>
                  {getSelectOptions(districts)}
                </SelectContent>
              </Select>
            </div>
            <Button
              disabled={isLoading || ((type == 'ALL' || type === 'TANKERS') && tab == RegisterActiveTab.EQUIPMENTS)}
              loading={isLoading}
              onClick={handleDownloadExel}
              className="hidden items-center gap-2 xl:flex xl:w-auto"
            >
              <Download className="h-4 w-4" /> Exel
            </Button>
          </div>

          {user?.role != UserRoles.INDIVIDUAL ? (
            <div className={cn('scrollbar-hidden flex overflow-x-auto')}>
              <TabsList className="min-w-max">
                <TabsTrigger value={RegisterActiveTab.HF}>
                  XICHO
                  <Badge variant="destructive" className="ml-2">
                    {hfCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>
                  Qurilmalar
                  <Badge variant="destructive" className="ml-2">
                    {equipmentsCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value={RegisterActiveTab.IRS}>
                  INM
                  <Badge variant="destructive" className="ml-2">
                    {irsCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value={RegisterActiveTab.XRAY}>
                  Rentgenlar
                  <Badge variant="destructive" className="ml-2">
                    {xrayCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          ) : (
            <div className={cn('scrollbar-hidden flex overflow-x-auto overflow-y-hidden')}>
              <TabsList>
                <TabsTrigger value={RegisterActiveTab.EQUIPMENTS}>
                  Qurilmalar
                  <Badge variant="destructive" className="ml-2">
                    {equipmentsCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          )}
        </div>
        <TabsContent value={RegisterActiveTab.HF} className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
          <HfList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.EQUIPMENTS} className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
          <EquipmentsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.IRS} className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
          <IrsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.XRAY} className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden">
          <XrayList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default React.memo(RegisterWidget)

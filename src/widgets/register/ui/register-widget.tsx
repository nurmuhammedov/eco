import { UserRoles } from '@/entities/user'
import { EquipmentsList } from '@/features/register/equipments/ui/equipments-list'
import { HfList } from '@/features/register/hf/ui/hf-list'
import { IrsList } from '@/features/register/irs/ui/irs-list'
import { XrayList } from '@/features/register/xray/ui/xray-list'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { useAuth } from '@/shared/hooks/use-auth'
import React, { Fragment, useState } from 'react'
import { RegisterActiveTab } from '../types'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { Button } from '@/shared/components/ui/button'
import { Download } from 'lucide-react'
import { API_ENDPOINTS } from '@/shared/api'
import { apiClient } from '@/shared/api/api-client'
import { format } from 'date-fns'
import { cn } from '@/shared/lib/utils'
import { AutoList } from '@/features/register/auto/ui/auto-list'
import { AddPermitTransportModal } from '@/features/register/auto/ui/add-auto-modal'
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
      ...rest
    },
    addParams,
    removeParams,
  } = useCustomSearchParams()

  const { data: hfCount = 0 } = useData<number>('/hf/count', user?.role != UserRoles.INDIVIDUAL, { mode })
  const { data: equipmentsCount = 0 } = useData<number>('/equipments/count', true, { mode })
  const { data: irsCount = 0 } = useData<number>('/irs/count', user?.role != UserRoles.INDIVIDUAL, { mode })
  const { data: xrayCount = 0 } = useData<number>('/xrays/count', user?.role != UserRoles.INDIVIDUAL, { mode })
  const { data: tankersCount } = useData<any>('/tankers/count', user?.role != UserRoles.INDIVIDUAL, { mode })

  const { data: regionOptions, isLoading: isLoadingRegions } = useData<any>(`${API_ENDPOINTS.REGIONS_SELECT}`)
  const { data: districts, isLoading: isDistrictsLoading } = useDistrictSelectQueries(rest?.regionId)

  const handleDownloadExel = () => {
    setIsLoading(true)
    apiClient
      .downloadFile<Blob>(`/${tab}/export/excel`, {
        mode,
        status: status === 'ALL' ? '' : status,
        type,
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
    <Fragment>
      <Tabs
        className="flex flex-1 flex-col"
        value={tab}
        onValueChange={(tab: string) => addParams({ tab: tab.toString() }, 'page', 'type', 'status')}
      >
        <div className={'flex items-center justify-between gap-2'}>
          {user?.role != UserRoles.INDIVIDUAL ? (
            <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
              <TabsList>
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
                <TabsTrigger value={RegisterActiveTab.AUTO}>
                  Harakatlanuvchi sig‘imlar
                  <Badge variant="destructive" className="ml-2">
                    {tankersCount?.allCount || 0}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </div>
          ) : (
            <div className={cn('scrollbar-hidden flex justify-between overflow-x-auto overflow-y-hidden')}>
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
          <div className="flex flex-1 items-center justify-end gap-2">
            {tab == RegisterActiveTab.AUTO ? (
              <>{user?.role == UserRoles.MANAGER && <AddPermitTransportModal />}</>
            ) : (
              <div className="flex gap-2">
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
                  <SelectTrigger className="max-w-70">
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
                    if (value && value !== 'ALL') {
                      addParams({ regionId: value }, 'page', 'districtId')
                    } else {
                      removeParams('regionId', 'districtId')
                    }
                  }}
                  value={rest?.regionId?.toString() || ''}
                  disabled={isLoadingRegions}
                >
                  <SelectTrigger className="max-w-60 min-w-40">
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
                  value={rest?.districtId?.toString() || ''}
                  disabled={isDistrictsLoading}
                >
                  <SelectTrigger className="max-w-60 min-w-40">
                    <SelectValue placeholder="Tuman" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Barchasi</SelectItem>
                    {getSelectOptions(districts)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {!(type == 'ALL' && tab == RegisterActiveTab.EQUIPMENTS) ? (
              <Button
                disabled={isLoading || tab == RegisterActiveTab.AUTO}
                loading={isLoading}
                onClick={handleDownloadExel}
              >
                <Download /> Exel
              </Button>
            ) : null}
          </div>
        </div>
        <TabsContent value={RegisterActiveTab.HF} className="mt-2 flex flex-1 flex-col">
          <HfList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.EQUIPMENTS} className="mt-2 flex flex-1 flex-col">
          <EquipmentsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.IRS} className="mt-2 flex flex-1 flex-col">
          <IrsList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.XRAY} className="mt-2 flex flex-1 flex-col">
          <XrayList />
        </TabsContent>
        <TabsContent value={RegisterActiveTab.AUTO} className="mt-2 flex flex-1 flex-col">
          <AutoList tankersCount={tankersCount} />
        </TabsContent>
      </Tabs>
    </Fragment>
  )
}

export default React.memo(RegisterWidget)

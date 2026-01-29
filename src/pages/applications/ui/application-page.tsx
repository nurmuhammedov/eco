import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/entities/user'
import { ApplicationTable } from '@/features/application/application-table'
import { useApplicationPage } from '@/features/application/application-table/hooks'
import { Button } from '@/shared/components/ui/button'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { TabsLayout } from '@/shared/layouts'
import { PlusCircle } from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { API_ENDPOINTS } from '@/shared/api'

const ApplicationPage = () => {
  const navigate = useNavigate()
  const {
    paramsObject: { mode = '', ...rest },
    addParams,
    removeParams,
  } = useCustomSearchParams()
  const { user } = useAuth()

  const { data: regionOptions, isLoading: isLoadingRegions } = useData<any>(`${API_ENDPOINTS.REGIONS_SELECT}`)

  const { handleChangeTab, applicationStatus } = useApplicationPage()
  const {
    paramsObject: { status = ApplicationStatus.ALL },
  } = useCustomSearchParams()

  const action = useMemo(() => {
    if ([UserRoles.LEGAL, UserRoles.INDIVIDUAL]?.includes(user?.role as unknown as UserRoles)) {
      return (
        <Button onClick={() => navigate('/applications/create')}>
          <PlusCircle /> Ariza yaratish
        </Button>
      )
    }

    if (UserRoles.INSPECTOR === user?.role || UserRoles.MANAGER === user?.role) {
      return (
        <Button onClick={() => navigate('/applications/inspector/create')}>
          <PlusCircle /> Ariza yaratish
        </Button>
      )
    }

    return null
  }, [user?.role, navigate])

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-row items-center justify-between gap-2 pt-0.5">
        <div className="min-w-0 flex-1">
          <TabsLayout activeTab={status} tabs={applicationStatus} onTabChange={handleChangeTab} />
        </div>
        <div className="flex flex-row items-center justify-between gap-2">
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
            <SelectTrigger className="max-w-80 min-w-60">
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
          {action}
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <ApplicationTable />
      </div>
    </div>
  )
}
export default ApplicationPage

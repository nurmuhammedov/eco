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
      <div className="flex flex-col gap-4 pt-1">
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center gap-2 overflow-x-auto pb-1 sm:overflow-visible sm:pb-0">
            <div className="flex min-w-max flex-1 items-center gap-2 sm:min-w-0">
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
                <SelectTrigger className="w-[200px] sm:w-60 lg:w-80">
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
                <SelectTrigger className="w-[150px] sm:w-40 lg:w-60">
                  <SelectValue placeholder="Hudud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Barchasi</SelectItem>
                  {getSelectOptions(regionOptions)}
                </SelectContent>
              </Select>
            </div>
            <div className="hidden sm:block">{action}</div>
          </div>
          <div className="block sm:hidden">{action && <div className="child:w-full w-full">{action}</div>}</div>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <TabsLayout activeTab={status} tabs={applicationStatus} onTabChange={handleChangeTab} />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <ApplicationTable />
      </div>
    </div>
  )
}
export default ApplicationPage

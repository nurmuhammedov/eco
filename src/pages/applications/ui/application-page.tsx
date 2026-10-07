import { ApplicationStatus } from '@/entities/application'
import { UserRoles } from '@/shared/types/user'
import { ApplicationTable } from '@/features/application/application-table'
import { useApplicationPage } from '@/features/application/application-table/hooks'
import { Button } from '@/shared/components/ui/button'
import { useCustomSearchParams, useData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { TabsLayout } from '@/shared/layouts'
import { PlusCircle } from 'lucide-react'
import { useMemo } from 'react'
import type { OptionItem } from '@/shared/types/general'
import { useNavigate } from 'react-router-dom'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { RegistrationMode } from '@/features/application/application-table/model/registration-mode'
import { getSelectOptions } from '@/shared/lib/get-select-options'
import { API_ENDPOINTS } from '@/shared/api'
import { paramText } from '@/shared/lib/url-params'

/**
 * Appeals filed by applicants and registrations made by the committee's own staff are
 * two lists for now: the law does not yet let the committee register by application.
 * Once it does, both can become one list again with the mode filter back on it.
 */
export const ApplicationListPage = ({ mode }: { mode: RegistrationMode }) => {
  const navigate = useNavigate()
  const { paramsObject: rest, addParams, removeParams } = useCustomSearchParams()
  const { user } = useAuth()
  const isRegistration = mode === RegistrationMode.UNOFFICIAL
  // Inspectors and regional heads work in one region (supervisors and controllers sign in
  // as these roles), so there is no region to pick
  const showRegionFilter = user?.role !== UserRoles.INSPECTOR && user?.role !== UserRoles.REGIONAL

  const { data: regionOptions, isLoading: isLoadingRegions } = useData<OptionItem<number>[]>(
    `${API_ENDPOINTS.REGIONS_SELECT}`,
    showRegionFilter
  )

  const { handleChangeTab, applicationStatus } = useApplicationPage(mode)
  const status = paramText(useCustomSearchParams().paramsObject.status, ApplicationStatus.ALL)

  const action = useMemo(() => {
    if (!isRegistration && (user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL)) {
      return (
        <Button onClick={() => navigate('/applications/add')}>
          <PlusCircle /> Ariza yaratish
        </Button>
      )
    }

    if (isRegistration && (UserRoles.INSPECTOR === user?.role || UserRoles.MANAGER === user?.role)) {
      return (
        <Button onClick={() => navigate('/registrations/add')}>
          <PlusCircle /> Ro‘yxatga olish
        </Button>
      )
    }

    return null
  }, [user?.role, navigate, isRegistration])

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <div className="flex flex-col gap-4 xl:flex-row-reverse xl:items-center xl:justify-between">
        <div className="flex w-full flex-col gap-4 xl:w-auto xl:flex-row xl:items-center">
          <div className="flex w-full flex-col gap-2 p-0.5 sm:flex-row sm:items-center xl:w-auto">
            {showRegionFilter && (
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
                <SelectTrigger className="w-full sm:w-fit sm:min-w-40 lg:w-fit lg:min-w-48">
                  <SelectValue placeholder="Hudud" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Barchasi</SelectItem>
                  {getSelectOptions(regionOptions)}
                </SelectContent>
              </Select>
            )}
            <div className="hidden sm:block">{action}</div>
          </div>
          <div className="block sm:hidden">{action && <div className="w-full [&>button]:w-full">{action}</div>}</div>
        </div>
        <div className="min-w-0 overflow-x-auto xl:flex-1">
          <TabsLayout activeTab={status} tabs={applicationStatus} onTabChange={handleChangeTab} />
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <ApplicationTable mode={mode} />
      </div>
    </div>
  )
}
const ApplicationPage = () => <ApplicationListPage mode={RegistrationMode.OFFICIAL} />

export default ApplicationPage

import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { changeTypeColumn } from '@/features/register/model/change-type-column'
import { XrayRow } from '@/features/register/model/types'
import { UserRoles } from '@/shared/types/user'
import { useAuth } from '@/shared/hooks/use-auth'

import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { TabsLayout } from '@/shared/layouts'
import { Badge } from '@/shared/components/ui/badge'
import { buildRegisterQuery } from '@/features/register/model/build-register-query'
import { REPORT_KEYS, RESET_KEYS } from '@/features/register/model/report-drill-down'
import { RegisterActiveTab } from '@/features/register/model/register-tabs'
import { paramText } from '@/shared/lib/url-params'

interface XrayListProps {
  isArchive?: boolean
  radiationProfileId?: string
  hideTabs?: boolean
}

export const XrayList = ({ isArchive, radiationProfileId, hideTabs }: XrayListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { paramsObject, addParams } = useCustomSearchParams()

  // Arriving from the deregistration report: the status came with the link.
  const fromReport = !!paramsObject.reportChangeBelongType

  const defaultRegionId =
    (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
      ? user.regionId.toString()
      : 'ALL'

  const { page = 1, size = 10, regionId = defaultRegionId, status = isArchive ? 'INACTIVE' : 'ACTIVE' } = paramsObject
  const changeStatus = paramText(paramsObject.changeStatus, 'ALL')

  const currentStatus = String(status)

  const isOrganizations = currentStatus === 'ORGANIZATIONS' || currentStatus === 'CHANGED_ORGANIZATIONS'

  const { endpoint, params } = buildRegisterQuery({
    tab: RegisterActiveTab.XRAY,
    paramsObject,
    isArchive,
    defaultRegionId,
    radiationProfileId,
  })

  const { data = [], isLoading, totalElements = 0 } = usePaginatedData<XrayRow>(endpoint, { page, size, ...params })

  const { data: changedCountData } = usePaginatedData<XrayRow>(
    `/xrays`,
    {
      changed: 'true',
      active: 'true',
      regionId: regionId === 'ALL' ? '' : regionId,
      size: 1,
    },
    !isArchive
  )

  const { data: changedOrgCountData } = usePaginatedData<XrayRow>(
    `/radiation-profiles`,
    {
      changed: 'true',
      type: 'XRAY',
      regionId: regionId === 'ALL' ? '' : regionId,
      size: 1,
    },
    !isArchive
  )

  const handleViewApplication = (id: string) => {
    if (currentStatus === 'CHANGED') {
      navigate(`/register/change/xrays/${id}`)
    } else if (currentStatus === 'CHANGED_ORGANIZATIONS') {
      navigate(`/register/change/radiation-profiles/${id}`)
    } else if (isOrganizations) {
      navigate(`/register/radiation-profiles/${id}?type=XRAY`)
    } else {
      const basePath = isArchive ? '/archive' : '/register'
      navigate(`${basePath}/xrays/${id}${currentStatus === 'ACTIVE' ? '?active=true' : ''}`)
    }
  }

  const handleEditApplication = (id: string, tin?: string | number) => {
    navigate(`/register/update/XRAY/${id}?tin=${tin}`)
  }

  const handleEditOrganization = (id: string) => {
    navigate(`/register/update-organization/XRAY/${id}`)
  }
  const columns: ExtendedColumnDef<XrayRow, unknown>[] = [
    {
      id: 'registrationDate',
      header: 'Ro‘yxatga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'Ro‘yxatga olish raqami',
      accessorKey: 'registryNumber',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'License tizimidagi ruxsatnoma reestri  tartib raqami',
      accessorKey: 'licenseRegistryNumber',
      filterKey: 'licenseRegistryNumber',
      filterType: 'search',
    },
    {
      header: 'Ruxsatnomani amal qilish muddati',
      accessorFn: (row) => row?.licenseExpiryDate,
    },
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
      filterType: 'number',
      filterMaxLength: 14,
    },
    {
      header: 'Rentgen joylashgan manzil',
      accessorKey: 'address',
      filterKey: 'address',
      filterType: 'search',
    },
    ...(currentStatus === 'CHANGED' ? [changeTypeColumn<XrayRow>()] : []),
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showDelete
          onView={(row) => handleViewApplication(row.original.id)}
          showEdit={
            !isArchive &&
            (user?.role === UserRoles.MANAGER || user?.role === UserRoles.LEGAL || user?.isController) &&
            ['ACTIVE', 'EXPIRED', 'NO_DATE'].includes(currentStatus)
          }
          onEdit={(row) => handleEditApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ]

  const canManageOrgs =
    user?.role === UserRoles.LEGAL ||
    user?.role === UserRoles.MANAGER ||
    user?.role === UserRoles.HEAD ||
    user?.isSupervisor ||
    user?.isController

  const orgColumns: ExtendedColumnDef<XrayRow, unknown>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
      filterType: 'number',
      filterMaxLength: 14,
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      header: 'Rahbar',
      accessorKey: 'directorName',
      filterKey: 'directorName',
      filterType: 'search',
    },
    {
      header: 'Rentgenlar soni',
      accessorKey: 'count',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          onView={(row) => handleViewApplication(row.original.id)}
          showEdit={!isArchive && currentStatus === 'ORGANIZATIONS' && canManageOrgs}
          onEdit={(row) => handleEditOrganization(row.original.id)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2">
      {!isArchive && !hideTabs && user?.role !== UserRoles.PROCURATOR && (
        <TabsLayout
          activeTab={currentStatus}
          tabs={
            [
              // { id: 'ALL', name: 'Barchasi', count: currentStatus === 'ALL' ? totalElements : undefined },
              {
                id: 'ACTIVE',
                name: 'Reyestrdagi rentgenlar',
                count: currentStatus === 'ACTIVE' ? totalElements : undefined,
              },
              {
                id: 'EXPIRED',
                name: 'Muddati o‘tganlar',
                count: currentStatus === 'EXPIRED' ? totalElements : undefined,
              },
              {
                id: 'NO_DATE',
                name: 'Muddati kiritilmaganlar',
                count: currentStatus === 'NO_DATE' ? totalElements : undefined,
              },
              {
                id: 'ORGANIZATIONS',
                name: 'Tashkilotlar',
                count: currentStatus === 'ORGANIZATIONS' ? totalElements : undefined,
              },
              {
                id: 'CHANGED',
                name: 'Rentgenlarni o‘zgartirish so‘rovlari',
                count: changedCountData?.page?.totalElements || 0,
              },
              canManageOrgs
                ? {
                    id: 'CHANGED_ORGANIZATIONS',
                    name: 'Tashkilotlarni o‘zgartirish so‘rovlari',
                    count: changedOrgCountData?.page?.totalElements || 0,
                  }
                : null,
            ].filter(Boolean) as any
          }
          onTabChange={(type) => {
            if (type === 'CHANGED' || type === 'CHANGED_ORGANIZATIONS') {
              addParams({ status: type, changeStatus: 'ALL' }, ...RESET_KEYS)
            } else {
              addParams({ status: type, changeStatus: '' }, ...RESET_KEYS)
            }
          }}
        />
      )}

      {(currentStatus === 'CHANGED' || currentStatus === 'CHANGED_ORGANIZATIONS') && !hideTabs && !fromReport && (
        <Tabs value={changeStatus} onValueChange={(val) => addParams({ changeStatus: val, page: 1 }, ...REPORT_KEYS)}>
          <TabsList>
            {[
              { id: 'ALL', name: 'Barchasi' },
              { id: 'NEW', name: 'Yangi' },
              { id: 'IN_PROCESS', name: 'Jarayonda' },
              { id: 'IN_AGREEMENT', name: 'Kelishuvda' },
              { id: 'IN_APPROVAL', name: 'Tasdiqlashda' },
            ].map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.name}
                {changeStatus === s.id && (
                  <Badge
                    variant="destructive"
                    className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
                  >
                    {totalElements || 0}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <DataTable
        showFilters
        isLoading={isLoading}
        isPaginated
        data={data || []}
        columns={isOrganizations ? orgColumns : columns}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

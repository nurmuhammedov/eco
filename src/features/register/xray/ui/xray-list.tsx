import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { TabsLayout } from '@/shared/layouts'

interface XrayListProps {
  isArchive?: boolean
  radiationProfileId?: string
  hideTabs?: boolean
}

export const XrayList = ({ isArchive, radiationProfileId, hideTabs }: XrayListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: {
      page = 1,
      size = 10,
      search = '',
      mode = '',
      officeId = '',
      regionId = (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
        ? user.regionId.toString()
        : 'ALL',
      districtId = '',
      startDate = '',
      endDate = '',
      status = isArchive ? 'INACTIVE' : 'ACTIVE',
      changeStatus = 'ALL',
      registryNumber = '',
      licenseRegistryNumber = '',
      legalName = '',
      legalTin = '',
      address = '',
      directorName = '',
    },
    addParams,
  } = useCustomSearchParams()

  const currentStatus = String(status)

  const isOrganizations = currentStatus === 'ORGANIZATIONS'
  const endpoint = isOrganizations ? '/radiation-profiles' : '/xrays'

  const {
    data = [],
    isLoading,
    totalElements = 0,
  } = usePaginatedData<any>(endpoint, {
    page,
    size,
    ...(isOrganizations
      ? {
          type: 'XRAY',
          legalName,
          legalTin,
          address,
          directorName,
          regionId: regionId === 'ALL' ? '' : regionId,
          districtId,
        }
      : {
          search,
          mode,
          officeId,
          regionId: regionId === 'ALL' ? '' : regionId,
          districtId,
          startDate,
          endDate,
          registryNumber,
          licenseRegistryNumber,
          legalName,
          legalTin,
          address,
          active: isArchive
            ? false
            : currentStatus === 'ACTIVE'
              ? true
              : currentStatus === 'INACTIVE'
                ? false
                : currentStatus === 'CHANGED'
                  ? ''
                  : true,
          changed: currentStatus === 'CHANGED' ? true : '',
          changeStatus: currentStatus === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
          status:
            currentStatus === 'CHANGED' && changeStatus !== 'ALL'
              ? changeStatus
              : currentStatus === 'EXPIRED' || currentStatus === 'NO_DATE'
                ? currentStatus
                : '',
          radiationProfileId,
        }),
  })

  const handleViewApplication = (id: string) => {
    if (currentStatus === 'CHANGED') {
      navigate(`/register/change/${id}/xrays`)
    } else if (isOrganizations) {
      navigate(`/register/radiation-profiles/${id}?type=XRAY`)
    } else {
      const basePath = isArchive ? '/archive' : '/register'
      navigate(`${basePath}/${id}/xrays${currentStatus === 'ACTIVE' ? '?active=true' : ''}`)
    }
  }

  const handleEditApplication = (id: string, tin: string) => {
    navigate(`/register/update/XRAY/${id}?tin=${tin}`)
  }
  const columns: ExtendedColumnDef<any, any>[] = [
    {
      id: 'registrationDate',
      header: 'Roʻyxatga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'Roʻyxatga olish raqami',
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
            (user?.role === UserRoles.MANAGER ||
              (user?.role === UserRoles.INSPECTOR &&
                (Number(row.original.regionId) === user?.regionId || user?.isController))) &&
            ['ACTIVE', 'EXPIRED', 'NO_DATE'].includes(currentStatus)
          }
          onEdit={(row) => handleEditApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ]

  const orgColumns: ExtendedColumnDef<any, any>[] = [
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
        <DataTableRowActions showView row={row} onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2">
      {!isArchive && !hideTabs && user?.role !== UserRoles.PROCURATOR && (
        <TabsLayout
          activeTab={currentStatus}
          tabs={[
            // { id: 'ALL', name: 'Barchasi', count: currentStatus === 'ALL' ? totalElements : undefined },
            {
              id: 'ACTIVE',
              name: 'Reyestrdagi rentgenlar',
              count: currentStatus === 'ACTIVE' ? totalElements : undefined,
            },
            // {
            //   id: 'INACTIVE',
            //   name: 'Reyestrdan chiqarilganlar',
            //   count: currentStatus === 'INACTIVE' ? totalElements : undefined,
            // },
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
          ]}
          onTabChange={(type) => {
            if (type === 'CHANGED') {
              addParams({ status: type, changeStatus: 'ALL' }, 'page')
            } else {
              addParams({ status: type, changeStatus: '' }, 'page')
            }
          }}
        />
      )}

      {currentStatus === 'CHANGED' && !hideTabs && (
        <Tabs value={changeStatus} onValueChange={(val) => addParams({ changeStatus: val, page: 1 })}>
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
        columns={(isOrganizations ? orgColumns : columns) as unknown as any}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

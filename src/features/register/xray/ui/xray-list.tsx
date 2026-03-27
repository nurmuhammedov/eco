import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { TabsLayout } from '@/shared/layouts'

export const XrayList = () => {
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
      status = 'ACTIVE',
      changeStatus = 'ALL',
      registryNumber = '',
      licenseRegistryNumber = '',
      legalName = '',
      legalTin = '',
      address = '',
    },
    addParams,
  } = useCustomSearchParams()

  const currentStatus = String(status)

  const {
    data = [],
    isLoading,
    totalElements = 0,
  } = usePaginatedData<any>(`/xrays`, {
    page,
    size,
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
    active: currentStatus === 'ACTIVE' ? true : currentStatus === 'INACTIVE' ? false : '',
    changed: currentStatus === 'CHANGED' ? true : '',
    changeStatus: currentStatus === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
    status:
      currentStatus === 'CHANGED' && changeStatus !== 'ALL'
        ? changeStatus
        : currentStatus === 'EXPIRED' || currentStatus === 'NO_DATE'
          ? currentStatus
          : '',
  })

  const handleViewApplication = (id: string) => {
    if (currentStatus === 'CHANGED') {
      navigate(`/register/change/${id}/xrays`)
    } else {
      navigate(`${id}/xrays${currentStatus === 'ACTIVE' ? '?active=true' : ''}`)
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
            (user?.role === UserRoles.MANAGER ||
              (user?.role === UserRoles.INSPECTOR && Number(row.original.regionId) === user?.regionId)) &&
            ['ACTIVE', 'EXPIRED', 'NO_DATE'].includes(currentStatus)
          }
          onEdit={(row) => handleEditApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2">
      <TabsLayout
        activeTab={currentStatus}
        tabs={[
          { id: 'ALL', name: 'Barchasi', count: currentStatus === 'ALL' ? totalElements : undefined },
          {
            id: 'ACTIVE',
            name: 'Reyestrdagi rentgenlar',
            count: currentStatus === 'ACTIVE' ? totalElements : undefined,
          },
          {
            id: 'INACTIVE',
            name: 'Reyestrdan chiqarilganlar',
            count: currentStatus === 'INACTIVE' ? totalElements : undefined,
          },
          { id: 'EXPIRED', name: 'Muddati o‘tganlar', count: currentStatus === 'EXPIRED' ? totalElements : undefined },
          {
            id: 'NO_DATE',
            name: 'Muddati kiritilmaganlar',
            count: currentStatus === 'NO_DATE' ? totalElements : undefined,
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

      {currentStatus === 'CHANGED' && (
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
        columns={columns as unknown as any}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

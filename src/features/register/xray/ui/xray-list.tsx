import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'

import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'

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
      regionId = '',
      districtId = '',
      startDate = '',
      endDate = '',
      active = 'true',
      changeStatus = 'ALL',
    },
    addParams,
  } = useCustomSearchParams()

  const currentActive = String(active)

  const { data = [], isLoading } = usePaginatedData<any>(`/xrays`, {
    page,
    size,
    search,
    mode,
    officeId,
    regionId,
    districtId,
    startDate,
    endDate,
    active: currentActive === 'ALL' || currentActive === 'CHANGED' ? '' : currentActive === 'true',
    changed: currentActive === 'CHANGED' ? true : '',
    changeStatus: currentActive === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
    status: currentActive === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
  })

  const { data: changedCountData } = usePaginatedData<any>(
    `/xrays`,
    {
      changed: 'true',
      size: 1,
    },
    true
  )

  const handleViewApplication = (id: string) => {
    if (currentActive === 'CHANGED') {
      navigate(`/register/change/${id}/xrays`)
    } else {
      navigate(`${id}/xrays`)
    }
  }

  const handleEditApplication = (id: string, tin: string) => {
    navigate(`/applications/create/ILLEGAL_REGISTER_XRAY?id=${id}&tin=${tin}`)
  }
  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Ruxsatnoma berilgan sana',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'Ruxsatnoma reestri bo‘yicha tartib raqami',
      accessorFn: (row) => row?.registryNumber,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'License tizimidagi ruxsatnoma reestri  tartib raqami',
      accessorFn: (row) => row?.licenseRegistryNumber,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Ruxsatnomani amal qilish muddati',
      accessorFn: (row) => row?.licenseExpiryDate,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorFn: (row) => row?.legalName,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      accessorFn: (row) => row?.legalTin,
      filterKey: 'search',
      filterType: 'search',
    },
    {
      header: 'Rentgen joylashgan manzil',
      accessorFn: (row) => row?.address,
      filterKey: 'search',
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
            user?.role == UserRoles.MANAGER || user?.role == UserRoles.INSPECTOR || user?.role == UserRoles.CHAIRMAN
          }
          onEdit={(row) => handleEditApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2">
      <Tabs value={currentActive} onValueChange={(val) => addParams({ active: val, page: 1, changeStatus: 'ALL' })}>
        <TabsList>
          <TabsTrigger value="ALL">Barchasi</TabsTrigger>
          <TabsTrigger value="true">Amaldagi Rentgenlar</TabsTrigger>
          <TabsTrigger value="false">Reyestrdan chiqarilganlar</TabsTrigger>
          <TabsTrigger value="CHANGED">
            O‘zgartirish so‘rovlari
            <Badge
              variant="destructive"
              className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
            >
              {changedCountData?.page?.totalElements || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {currentActive === 'CHANGED' && (
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

export default XrayList

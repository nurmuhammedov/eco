import { IrsCategory, IrsUsageType } from '@/entities/create-application'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { Badge } from '@/shared/components/ui/badge'

export const IrsList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: {
      size = 10,
      page = 1,
      mode = '',
      search = '',
      regionId = '',
      districtId = '',
      registryNumber = '',
      legalName = '',
      legalAddress = '',
      legalTin = '',
      address = '',
      category = '',
      activity = '',
      sphere = '',
      symbol = '',
      usageType = '',
      startDate = '',
      endDate = '',
      valid = 'true',
      changeStatus = 'ALL',
    },
    addParams,
  } = useCustomSearchParams()

  const currentValid = String(valid)

  const {
    data = [],
    isLoading,
    totalElements = 0,
  } = usePaginatedData<any>(`/irs`, {
    page,
    size,
    mode,
    regionId,
    districtId,
    search,
    registryNumber,
    legalName,
    legalAddress,
    legalTin,
    address,
    category,
    activity,
    sphere,
    symbol,
    usageType,
    startDate,
    endDate,
    valid:
      currentValid === 'all'
        ? undefined
        : currentValid === 'true'
          ? true
          : currentValid === 'false'
            ? false
            : undefined,
    changed: currentValid === 'CHANGED' ? true : '',
    changeStatus: currentValid === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
    status: currentValid === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
  })

  // const { data: changedCountData } = usePaginatedData<any>(
  //   `/irs`,
  //   {
  //     changed: 'true',
  //     size: 1,
  //   },
  //   true
  // )

  const handleViewApplication = (id: string) => {
    if (currentValid === 'CHANGED') {
      navigate(`/register/change/${id}/irs`)
    } else {
      navigate(`${id}/irs`)
    }
  }

  const handleEditApplication = (id: string, tin: string) => {
    navigate(`/register/update/IRS/${id}?tin=${tin}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'INM hisobga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      filterKey: 'registrationDate',
      filterType: 'date-range',
    },
    {
      header: 'INM ro‘yxat raqami',
      accessorFn: (row) => row?.registryNumber,
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorFn: (row) => row?.legalName,
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      accessorFn: (row) => row?.legalAddress,
      filterKey: 'legalAddress',
      filterType: 'search',
    },
    {
      header: 'Tashkilot STIR',
      accessorFn: (row) => row?.legalTin,
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      header: 'INM manzili',
      accessorFn: (row) => row?.address,
      filterKey: 'address',
      filterType: 'search',
    },
    {
      header: 'Kategoriyasi',
      accessorFn: (row) => row?.category,
      filterKey: 'category',
      filterType: 'select',
      filterOptions: Object.values(IrsCategory).map((val) => ({
        id: val,
        name: val,
      })),
    },
    {
      header: 'Aktivligi',
      accessorFn: (row) => row?.activity,
      filterKey: 'activity',
      filterType: 'search',
    },
    {
      header: 'Soha',
      accessorFn: (row) => row?.sphere,
      filterKey: 'sphere',
      filterType: 'search',
    },
    {
      header: 'Radionuklid belgisi',
      accessorFn: (row) => row?.symbol,
      filterKey: 'symbol',
      filterType: 'search',
    },
    {
      header: 'Foydalanish maqsadi',
      accessorFn: (row) =>
        [
          { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
          { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
          { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
          { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
        ]?.find((i) => i?.id == row?.usageType)?.name || '',
      filterKey: 'usageType',
      filterType: 'select',
      filterOptions: [
        { id: IrsUsageType.USAGE, name: 'Ishlatish (foydalanish) uchun' },
        { id: IrsUsageType.DISPOSAL, name: 'Ko‘mish uchun' },
        { id: IrsUsageType.EXPORT, name: 'Chet-elga olib chiqish uchun' },
        { id: IrsUsageType.STORAGE, name: 'Vaqtinchalik saqlash uchun' },
      ],
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showDelete
          onView={(row) => handleViewApplication(row.original.id)}
          showEdit={(user?.role === UserRoles.MANAGER || user?.role === UserRoles.INSPECTOR) && currentValid === 'true'}
          onEdit={(row) => handleEditApplication(row.original.id, row.original.legalTin)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2">
      <Tabs value={currentValid} onValueChange={(val) => addParams({ valid: val, page: 1, changeStatus: 'ALL' })}>
        <TabsList>
          <TabsTrigger value="all">
            Barchasi
            {currentValid === 'all' && (
              <Badge
                variant="destructive"
                className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
              >
                {totalElements}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="true">
            Amaldagi INMlar
            {currentValid === 'true' && (
              <Badge
                variant="destructive"
                className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
              >
                {totalElements}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="false">
            Reyestrdan chiqarilgan INMlar
            {currentValid === 'false' && (
              <Badge
                variant="destructive"
                className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
              >
                {totalElements}
              </Badge>
            )}
          </TabsTrigger>
          {/*<TabsTrigger value="CHANGED">*/}
          {/*  O‘zgartirish so‘rovlari*/}
          {/*  <Badge*/}
          {/*    variant="destructive"*/}
          {/*    className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"*/}
          {/*  >*/}
          {/*    {changedCountData?.page?.totalElements || 0}*/}
          {/*  </Badge>*/}
          {/*</TabsTrigger>*/}
        </TabsList>
      </Tabs>

      {currentValid === 'CHANGED' && (
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
        isPaginated
        isLoading={isLoading}
        data={data || []}
        columns={columns as unknown as any}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

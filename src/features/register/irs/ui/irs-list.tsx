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

interface IrsListProps {
  isArchive?: boolean
  radiationProfileId?: string
  hideTabs?: boolean
}

export const IrsList = ({ isArchive, radiationProfileId, hideTabs }: IrsListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    paramsObject: {
      size = 10,
      page = 1,
      mode = '',
      search = '',
      regionId = (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
        ? user.regionId.toString()
        : 'ALL',
      districtId = '',
      registryNumber = '',
      legalName = '',
      legalAddress = '',
      legalTin = '',
      address = '',
      directorName = '',
      category = '',
      activity = '',
      factoryNumber = '',
      symbol = '',
      usageType = '',
      startDate = '',
      endDate = '',
      valid = isArchive ? 'false' : 'true',
      changeStatus = 'ALL',
    },
    addParams,
  } = useCustomSearchParams()

  const currentValid = String(valid)

  const isOrganizations = currentValid === 'ORGANIZATIONS' || currentValid === 'CHANGED_ORGANIZATIONS'

  const endpoint = isOrganizations ? '/radiation-profiles' : '/irs'

  const {
    data = [],
    isLoading,
    totalElements = 0,
  } = usePaginatedData<any>(endpoint, {
    page,
    size,
    ...(isOrganizations
      ? {
          type: 'IRS',
          legalName,
          legalTin,
          address: legalAddress || address,
          directorName,
          regionId: regionId === 'ALL' ? '' : regionId,
          districtId,
          changed: currentValid === 'CHANGED_ORGANIZATIONS' ? true : '',
          changeStatus: currentValid === 'CHANGED_ORGANIZATIONS' && changeStatus !== 'ALL' ? changeStatus : '',
        }
      : {
          mode,
          regionId: regionId === 'ALL' ? '' : regionId,
          districtId,
          search,
          registryNumber,
          legalName,
          legalAddress,
          legalTin,
          address,
          category,
          activity,
          factoryNumber,
          symbol,
          usageType,
          startDate,
          endDate,
          valid: currentValid === 'CHANGED' ? true : isArchive ? false : currentValid !== 'false',
          changed: currentValid === 'CHANGED' ? true : '',
          changeStatus: currentValid === 'CHANGED' && changeStatus !== 'ALL' ? changeStatus : '',
          status: '',
          radiationProfileId,
        }),
  })

  const { data: changedCountData } = usePaginatedData<any>(
    `/irs`,
    {
      changed: 'true',
      valid: 'true',
      regionId: regionId === 'ALL' ? '' : regionId,
      size: 1,
    },
    !isArchive
  )

  const { data: changedOrgCountData } = usePaginatedData<any>(
    `/radiation-profiles`,
    {
      changed: 'true',
      type: 'IRS',
      regionId: regionId === 'ALL' ? '' : regionId,
      size: 1,
    },
    !isArchive
  )

  const handleViewApplication = (id: string) => {
    if (currentValid === 'CHANGED') {
      navigate(`/register/change/${id}/irs`)
    } else if (currentValid === 'CHANGED_ORGANIZATIONS') {
      navigate(`/register/change/${id}/radiation-profiles`)
    } else if (isOrganizations) {
      navigate(`/register/radiation-profiles/${id}?type=IRS`)
    } else {
      const basePath = isArchive ? '/archive' : '/register'
      navigate(`${basePath}/${id}/irs`)
    }
  }

  const handleEditApplication = (id: string, tin: string) => {
    navigate(`/register/update/IRS/${id}?tin=${tin}`)
  }

  const handleEditOrganization = (id: string) => {
    navigate(`/register/update-organization/IRS/${id}`)
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
      header: 'Radionuklid belgisi',
      accessorFn: (row) => row?.symbol,
      filterKey: 'symbol',
      filterType: 'search',
    },
    {
      header: 'Zavod raqami',
      accessorFn: (row) => row?.factoryNumber,
      filterKey: 'factoryNumber',
      filterType: 'search',
    },
    {
      header: 'Aktivligi',
      accessorFn: (row) => row?.activity,
      filterKey: 'activity',
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
          showEdit={
            !isArchive &&
            (user?.role === UserRoles.MANAGER || user?.role === UserRoles.LEGAL || user?.isController) &&
            currentValid === 'true'
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
      header: 'INMlar soni',
      accessorKey: 'count',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          onView={(row) => handleViewApplication(row.original.id)}
          showEdit={!isArchive && currentValid === 'ORGANIZATIONS' && canManageOrgs}
          onEdit={(row) => handleEditOrganization(row.original.id)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2">
      {!isArchive && !hideTabs && user?.role !== UserRoles.PROCURATOR && (
        <Tabs value={currentValid} onValueChange={(val) => addParams({ valid: val, page: 1, changeStatus: 'ALL' })}>
          <div className="scrollbar-hidden flex overflow-x-auto">
            <TabsList className="min-w-max">
              {/*<TabsTrigger value="all">*/}
              {/*  Barchasi*/}
              {/*  {currentValid === 'all' && (*/}
              {/*    <Badge*/}
              {/*      variant="destructive"*/}
              {/*      className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"*/}
              {/*    >*/}
              {/*      {totalElements}*/}
              {/*    </Badge>*/}
              {/*  )}*/}
              {/*</TabsTrigger>*/}
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
              <TabsTrigger value="ORGANIZATIONS">
                Tashkilotlar
                {currentValid === 'ORGANIZATIONS' && (
                  <Badge
                    variant="destructive"
                    className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
                  >
                    {totalElements}
                  </Badge>
                )}
              </TabsTrigger>
              {/*<TabsTrigger value="false">*/}
              {/*  Reyestrdan chiqarilgan INMlar*/}
              {/*  {currentValid === 'false' && (*/}
              {/*    <Badge*/}
              {/*      variant="destructive"*/}
              {/*      className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"*/}
              {/*    >*/}
              {/*      {totalElements}*/}
              {/*    </Badge>*/}
              {/*  )}*/}
              {/*</TabsTrigger>*/}
              <TabsTrigger value="CHANGED">
                INMlarni o‘zgartirish so‘rovlari
                <Badge
                  variant="destructive"
                  className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
                >
                  {changedCountData?.page?.totalElements || 0}
                </Badge>
              </TabsTrigger>
              {canManageOrgs && (
                <TabsTrigger value="CHANGED_ORGANIZATIONS">
                  Tashkilotlarni o‘zgartirish so‘rovlari
                  <Badge
                    variant="destructive"
                    className="group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary ml-2"
                  >
                    {changedOrgCountData?.page?.totalElements || 0}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>
          </div>
        </Tabs>
      )}

      {(currentValid === 'CHANGED' || currentValid === 'CHANGED_ORGANIZATIONS') && !hideTabs && (
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
        columns={(isOrganizations ? orgColumns : columns) as unknown as any}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

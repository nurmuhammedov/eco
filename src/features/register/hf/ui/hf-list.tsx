import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useHazardousFacilityTypeDictionarySelect } from '@/shared/api/dictionaries'
import { UserRoles } from '@/entities/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { TabsLayout } from '@/shared/layouts'
import { ApplicationStatus } from '@/entities/application'
import { useTranslatedObject } from '@/shared/hooks'
import { useMemo } from 'react'

export const HfList = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    addParams,
    paramsObject: {
      page = 1,
      size = 10,
      search = '',
      mode = '',
      registryNumber = '',
      legalTin = '',
      legalName = '',
      legalAddress = '',
      name = '',
      active = 'true',
      address = '',
      regionId = '',
      districtId = '',
      hfTypeId = '',
      startDate = '',
      endDate = '',
      status = 'ALL',
    },
  } = useCustomSearchParams()

  const currentActive = String(active)
  const currentStatus = String(status)

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  const { data: changedCountData } = usePaginatedData<any>(`/hf`, {
    page: 1,
    size: 1,
    changed: 'true',
    regionId,
    districtId,
    hfTypeId,
    startDate,
    endDate,
  })

  const { data, isLoading } = usePaginatedData<any>(`/hf`, {
    page,
    size,
    search,
    mode,
    registryNumber,
    legalTin,
    legalName,
    legalAddress,
    name,
    address,
    status: currentActive !== 'CHANGED' || currentStatus === 'ALL' ? '' : currentStatus,
    active: currentActive === 'ALL' || currentActive === 'CHANGED' ? '' : currentActive === 'true',
    changed: currentActive === 'CHANGED' ? true : '',
    changeStatus: currentActive === 'CHANGED' && currentStatus !== 'ALL' ? currentStatus : '',
    regionId,
    districtId,
    hfTypeId,
    startDate,
    endDate,
  })

  const applicationStatusList = useTranslatedObject(ApplicationStatus, 'application_status', false)
  const applicationStatus = useMemo(() => {
    return applicationStatusList.filter((s: { id: string; name: string }) =>
      ['ALL', 'NEW', 'IN_PROCESS', 'IN_AGREEMENT', 'IN_APPROVAL'].includes(s.id)
    )
  }, [applicationStatusList])

  const handleViewApplication = (id: string) => {
    if (currentActive === 'CHANGED') {
      navigate(`/register/change/${id}/hf`)
    } else {
      navigate(`${id}/hf`)
    }
  }

  const handleEditApplication = (data: any) => {
    const tinQuery = user?.role === UserRoles.INSPECTOR ? `?tin=${data?.legalTin}` : ''
    navigate(`/register/update/HF/${data?.id}${tinQuery}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Roʻyxatga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      maxSize: 90,
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
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
      filterKey: 'legalAddress',
      filterType: 'search',
    },
    {
      header: 'STIR',
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
      filterType: 'number',
      maxSize: 90,
      filterMaxLength: 9,
    },
    {
      header: 'XICHO nomi',
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },
    {
      accessorKey: 'address',
      header: 'XICHO manzili',
      filterKey: 'address',
      filterType: 'search',
    },
    {
      header: 'XICHO turi',
      accessorKey: 'typeName',
      filterKey: 'hfTypeId',
      filterType: 'select',
      maxSize: 80,
      filterOptions: hazardousFacilityTypes || [],
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showEdit={
            currentActive === 'true' &&
            (user?.role === UserRoles.INSPECTOR ||
              user?.role === UserRoles.LEGAL ||
              user?.role === UserRoles.INDIVIDUAL)
          }
          showDelete
          onView={(row) => handleViewApplication(row.original.id)}
          onEdit={(row) => handleEditApplication(row.original)}
        />
      ),
    },
  ]

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <TabsLayout
        activeTab={currentActive}
        tabs={[
          {
            id: 'ALL',
            name: 'Barchasi',
          },
          {
            id: 'true',
            name: 'Amaldagi XICHOlar',
          },
          {
            id: 'false',
            name: 'Reyestrdan chiqarilgan XICHOlar',
          },
          {
            id: 'CHANGED',
            name: 'O‘zgartirish so‘rovlari',
            count: changedCountData?.page?.totalElements || undefined,
          },
        ]?.map((i) => ({
          ...i,
          count:
            i.id === 'CHANGED' ? i.count : i?.id == currentActive ? data?.page?.totalElements || undefined : undefined,
        }))}
        onTabChange={(type) => {
          if (type === 'CHANGED') {
            addParams({ active: type, status: 'ALL' }, 'page')
          } else {
            addParams({ active: type, status: '' }, 'page')
          }
        }}
      />
      {currentActive === 'CHANGED' && (
        <TabsLayout
          activeTab={currentStatus}
          tabs={applicationStatus.map((s: { id: string; name: string }) => ({
            ...s,
            count: s.id === currentStatus ? (data?.page?.totalElements ?? 0) : undefined,
          }))}
          onTabChange={(s) => addParams({ status: s }, 'page')}
        />
      )}
      <DataTable
        showFilters={true}
        isLoading={isLoading}
        isPaginated
        data={data || []}
        columns={columns as unknown as any}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

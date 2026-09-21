import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData, useTranslatedObject } from '@/shared/hooks'
import { getDate } from '@/shared/utils/date'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { changeTypeColumn } from '@/features/register/model/change-type-column'
import { useHazardousFacilityTypeDictionarySelect } from '@/shared/api/dictionaries'
import { UserRoles } from '@/shared/types/user'
import { useAuth } from '@/shared/hooks/use-auth'
import { TabsLayout } from '@/shared/layouts'
import { ApplicationStatus } from '@/entities/application'
import { useMemo } from 'react'
import { buildRegisterQuery } from '@/features/register/model/build-register-query'
import { RESET_KEYS } from '@/features/register/model/report-drill-down'
import { canUpdateRegistryType } from '@/features/register/model/can-update-registry'
import { TruncatedCell } from '@/shared/components/common/truncated-cell'
import { HazardousFacilityRow } from '@/features/register/model/types'
import { RegisterActiveTab } from '@/features/register/model/register-tabs'

interface HfListProps {
  isArchive?: boolean
}

export const HfList = ({ isArchive }: HfListProps) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addParams, paramsObject } = useCustomSearchParams()

  // Arriving from the deregistration report: the status came with the link.
  const fromReport = !!paramsObject.reportChangeBelongType

  const defaultRegionId =
    (user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL) && user?.regionId
      ? user.regionId.toString()
      : 'ALL'

  const {
    page = 1,
    size = 10,
    active = isArchive ? 'false' : 'true',
    regionId = defaultRegionId,
    status = 'ALL',
  } = paramsObject

  const currentActive = String(active)
  const currentStatus = String(status)

  const { endpoint, params } = buildRegisterQuery({
    tab: RegisterActiveTab.HF,
    paramsObject,
    isArchive,
    defaultRegionId,
  })

  const { data: hazardousFacilityTypes } = useHazardousFacilityTypeDictionarySelect()

  /**
   * The dictionary also carries the parent tiers (1, 2, 3) and the two the
   * registry never assigns; a facility is filed under one of these three.
   */
  const hfTypeOptions = useMemo(
    () => (hazardousFacilityTypes || []).filter((item) => ['3.1', '3.2', '3.3'].includes(String(item.name))),
    [hazardousFacilityTypes]
  )

  const { data: changedCountData } = usePaginatedData<HazardousFacilityRow>(`/hf`, {
    page: 1,
    size: 1,
    changed: 'true',
    active: true,
    regionId: regionId === 'ALL' ? '' : regionId,
  })

  const { data, isLoading } = usePaginatedData<HazardousFacilityRow>(endpoint, { page, size, ...params })

  const applicationStatusList = useTranslatedObject(ApplicationStatus, 'application_status', false)
  const applicationStatus = useMemo(() => {
    return applicationStatusList.filter((s: { id: string; name: string }) =>
      ['ALL', 'NEW', 'IN_PROCESS', 'IN_AGREEMENT', 'IN_APPROVAL'].includes(s.id)
    )
  }, [applicationStatusList])

  const handleViewApplication = (id: string) => {
    if (currentActive === 'CHANGED') {
      navigate(`/register/change/hf/${id}`)
    } else {
      navigate(`hf/${id}${['true', 'VALID', 'INVALID'].includes(currentActive) ? '?active=true' : ''}`)
    }
  }

  const handleEditApplication = (data: HazardousFacilityRow) => {
    const tinQuery = data?.legalTin ? `?tin=${data.legalTin}` : ''
    navigate(`/register/update/HF/${data?.id}${tinQuery}`)
  }

  const columns: ExtendedColumnDef<HazardousFacilityRow, unknown>[] = [
    {
      header: 'Ro‘yxatga olish sanasi',
      accessorFn: (row) => getDate(row.registrationDate),
      maxSize: 90,
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
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'Tashkilot manzili',
      accessorKey: 'legalAddress',
      className: 'max-w-[220px]',
      filterKey: 'legalAddress',
      filterType: 'search',
      cell: ({ row }) => <TruncatedCell value={row.original?.legalAddress} />,
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
      className: 'max-w-[220px]',
      filterKey: 'address',
      filterType: 'search',
      cell: ({ row }) => <TruncatedCell value={row.original?.address} />,
    },
    {
      header: 'XICHO turi',
      accessorKey: 'typeName',
      filterKey: 'hfTypeId',
      filterType: 'select',
      maxSize: 80,
      filterOptions: hfTypeOptions,
    },
    ...(currentActive === 'CHANGED' ? [changeTypeColumn<HazardousFacilityRow>()] : []),
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showView
          row={row}
          showEdit={
            !isArchive &&
            canUpdateRegistryType('HF', user?.role) &&
            currentActive === 'true' &&
            ((user?.role === UserRoles.INSPECTOR &&
              (Number(row.original.regionId) === user?.regionId || user?.isController)) ||
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
      {!isArchive && user?.role !== UserRoles.PROCURATOR && (
        <TabsLayout
          activeTab={currentActive}
          tabs={[
            {
              id: 'true',
              name: 'Reyestrdagi XICHOlar',
            },
            {
              id: 'VALID',
              name: 'Faol XICHOlar',
            },
            {
              id: 'INVALID',
              name: 'Nofaol XICHOlar',
            },
            {
              id: 'CHANGED',
              name: 'O‘zgartirish so‘rovlari',
              count: fromReport
                ? data?.page?.totalElements || undefined
                : changedCountData?.page?.totalElements || undefined,
            },
          ]?.map((i) => ({
            ...i,
            count:
              i.id === 'CHANGED'
                ? i.count
                : i?.id == currentActive
                  ? data?.page?.totalElements || undefined
                  : undefined,
          }))}
          onTabChange={(type) => {
            if (type === 'CHANGED') {
              addParams({ active: type, status: 'ALL' }, ...RESET_KEYS)
            } else {
              addParams({ active: type, status: '' }, ...RESET_KEYS)
            }
          }}
        />
      )}
      {!isArchive && !fromReport && currentActive === 'CHANGED' && (
        <TabsLayout
          activeTab={currentStatus}
          tabs={applicationStatus.map((s: { id: string; name: string }) => ({
            ...s,
            count: s.id === currentStatus ? (data?.page?.totalElements ?? 0) : undefined,
          }))}
          onTabChange={(s) => addParams({ status: s }, ...RESET_KEYS)}
        />
      )}
      <DataTable
        showFilters={true}
        isLoading={isLoading}
        isPaginated
        data={data || []}
        columns={columns}
        className="min-h-0 flex-1"
      />
    </div>
  )
}

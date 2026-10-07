import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { TruncatedCell } from '@/shared/components/common/truncated-cell'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { useDistrictSelectQuery, useRegionSelectQuery } from '@/shared/api/dictionaries'
import { paramText } from '@/shared/lib/url-params'
import { UserRoles } from '@/shared/types/user'
import { getDate } from '@/shared/utils/date'
import { SAFE_ELEVATOR_TYPE_OPTIONS, SafeElevator, safeElevatorStatusName } from '@/entities/safe-elevator'
import React, { useMemo, useState } from 'react'
import { SafeElevatorDetails } from './safe-elevator-details'

/** Elevators the "Xavfsiz lift" register sends through the IIP push service */
const ElevatorsWidget = () => {
  const { user } = useAuth()
  const { paramsObject } = useCustomSearchParams()
  const [selected, setSelected] = useState<SafeElevator | null>(null)

  // The backend pins these roles to their own region, so their region filter is not offered.
  const isRegionBound = user?.role === UserRoles.INSPECTOR || user?.role === UserRoles.REGIONAL

  const { page = 1, size = 10 } = paramsObject
  const regionId = isRegionBound ? String(user?.regionId ?? '') : paramText(paramsObject.regionId)

  const { data: regions } = useRegionSelectQuery(!isRegionBound)
  const { data: districts } = useDistrictSelectQuery(regionId || undefined)

  const { data, isLoading } = usePaginatedData<SafeElevator>('/safe-elevators', {
    page,
    size,
    regionId: isRegionBound ? '' : regionId,
    districtId: paramText(paramsObject.districtId),
    serialNumber: paramText(paramsObject.serialNumber),
    customerName: paramText(paramsObject.customerName),
    customerTin: paramText(paramsObject.customerTin),
    address: paramText(paramsObject.address),
    type: paramText(paramsObject.type),
    maintenanceCompany: paramText(paramsObject.maintenanceCompany),
  })

  const regionOptions = useMemo(() => (regions ?? []).map((r) => ({ id: String(r.id), name: r.name })), [regions])
  const districtOptions = useMemo(() => (districts ?? []).map((d) => ({ id: String(d.id), name: d.name })), [districts])

  const columns: ExtendedColumnDef<SafeElevator, unknown>[] = [
    {
      header: 'Seriya raqami',
      accessorKey: 'serialNumber',
      filterKey: 'serialNumber',
      filterType: 'search',
    },
    {
      header: 'Buyurtmachi',
      accessorKey: 'customerName',
      className: 'max-w-[220px]',
      filterKey: 'customerName',
      filterType: 'search',
      cell: ({ row }) => <TruncatedCell value={row.original.customerName} />,
    },
    {
      header: 'STIR',
      accessorKey: 'customerTin',
      filterKey: 'customerTin',
      filterType: 'number',
      filterMaxLength: 9,
    },
    ...(isRegionBound
      ? []
      : [
          {
            header: 'Viloyat',
            accessorKey: 'regionName',
            filterKey: 'regionId',
            filterType: 'select',
            filterOptions: regionOptions,
          } as ExtendedColumnDef<SafeElevator, unknown>,
        ]),
    {
      header: 'Tuman',
      accessorKey: 'districtName',
      filterKey: 'districtId',
      filterType: 'select',
      filterOptions: districtOptions,
    },
    {
      header: 'Manzil',
      accessorKey: 'address',
      className: 'max-w-[240px]',
      filterKey: 'address',
      filterType: 'search',
      cell: ({ row }) => <TruncatedCell value={row.original.address} />,
    },
    {
      header: 'Lift turi',
      accessorKey: 'typeName',
      filterKey: 'type',
      filterType: 'select',
      filterOptions: SAFE_ELEVATOR_TYPE_OPTIONS,
    },
    {
      header: 'Qavatlar soni',
      accessorKey: 'floors',
    },
    {
      header: 'Texnik xizmat ko‘rsatuvchi',
      accessorKey: 'maintenanceCompany',
      filterKey: 'maintenanceCompany',
      filterType: 'search',
    },
    {
      header: 'Keyingi texnik ko‘rik sanasi',
      id: 'nextInspectionDate',
      accessorFn: (row) => (row.nextInspectionDate ? getDate(row.nextInspectionDate) : '-'),
    },
    {
      header: 'Status',
      id: 'status',
      accessorFn: (row) => safeElevatorStatusName(row.status) ?? '-',
    },
    {
      id: 'actions',
      cell: ({ row }) => <DataTableRowActions showView row={row} onView={(row) => setSelected(row.original)} />,
    },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <DataTable showFilters isPaginated data={data || []} columns={columns} isLoading={isLoading} className="flex-1" />
      <SafeElevatorDetails elevator={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default React.memo(ElevatorsWidget)

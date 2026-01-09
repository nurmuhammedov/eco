import { useInspections } from '@/entities/inspection/hooks/use-inspection-query'
import { Inspection } from '@/entities/inspection/models/inspection.types'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { useAuth } from '@/shared/hooks/use-auth'
import { InspectionStatus, InspectionSubMenuStatus } from '@/widgets/inspection/ui/inspection-widget'
import { Eye } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRoles } from '@/entities/user'
import { getQuarter } from 'date-fns'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table.tsx'
import { useDistrictSelectQueries } from '@/shared/api/dictionaries'

export const InspectionList: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isInspector = user?.role === UserRoles.INSPECTOR
  const isRegional = user?.role === UserRoles.REGIONAL

  const {
    paramsObject: {
      status = InspectionStatus.ALL,
      subStatus = InspectionSubMenuStatus.ASSIGNED,
      year = new Date().getFullYear(),
      regionId = 'ALL',
      quarter = getQuarter(new Date()).toString(),
      ...rest
    },
  } = useCustomSearchParams()

  // const { data: regions = [] } = useData<{ id: number; name: string }[]>('/regions/select')
  // const activeRegion = regionId?.toString() || (regions && regions.length > 0 ? regions[0].id?.toString() : '')

  const { data: districts } = useDistrictSelectQueries(
    isInspector || isRegional ? undefined : regionId == 'ALL' ? '' : regionId
  )

  const { data: inspections, isLoading } = useInspections({
    ...rest,
    quarter,
    regionId: regionId == 'ALL' ? '' : regionId,
    year,
    status: [UserRoles.LEGAL, UserRoles?.INSPECTOR]?.includes(user?.role as unknown as UserRoles)
      ? subStatus
      : status === InspectionStatus.ALL
        ? undefined
        : status == InspectionStatus.ASSIGNED
          ? subStatus
          : status,
  })

  const handleView = (row: Inspection) => {
    navigate(`/inspections/info?inspectionId=${row.id}&tin=${row.tin}&name=${row.legalName}&year=${year}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
      filterKey: 'legalName',
      filterType: 'search',
    },
    {
      header: 'STIR',
      accessorKey: 'tin',
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      header: 'Tashkilot joylashgan Viloyat',
      accessorKey: 'regionName',
      // filterKey: 'legalRegionId',
      // filterType: 'select',
      // filterOptions:
      //   regions?.map((i) => ({
      //     ...i,
      //     id: i?.id?.toString(),
      //   })) || [],
    },
    {
      header: 'Tashkilot joylashgan Tuman',
      accessorKey: 'districtName',
      filterKey: isRegional || isInspector ? '' : 'legalDistrictId',
      filterType: 'select',
      filterOptions:
        districts?.map((i: any) => ({
          ...i,
          id: i?.id?.toString(),
        })) || [],
    },
    {
      header: 'Tashkilot joylashgan manzili',
      accessorKey: 'legalAddress',
      filterKey: 'legalAddress',
      filterType: 'search',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => handleView(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <DataTable
      isPaginated
      showFilters={true}
      data={inspections || []}
      columns={columns as unknown as any}
      isLoading={isLoading}
      className="h-[calc(100vh-360px)]"
    />
  )
}

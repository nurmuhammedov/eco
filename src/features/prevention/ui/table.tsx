import { UserRoles } from '@/entities/user'
import { AssignInspectorModal } from '@/features/prevention/ui/parts/assign-inspector-modal'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { AssignInspectorButton } from '@/features/risk-analysis/ui/assign-inspector-button'
import { getCurrentMonthEnum } from '@/widgets/prevention/ui/prevention-widget'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/shared/components/ui/badge'

interface Props {
  regions?: any
}

const PreventionTable: FC<Props> = ({ regions }) => {
  const { user } = useAuth()
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const isRegional = user?.role === UserRoles.REGIONAL
  const isInspector = user?.role === UserRoles.INSPECTOR

  const {
    paramsObject: {
      assignment: activeAssignedStatus = isInspector ? 'ASSIGNED' : 'ALL',
      belongType = 'HF',
      month = getCurrentMonthEnum(),
      year = new Date().getFullYear(),
      regionId = !isRegional && !isInspector && regions && regions.length > 0 ? regions[0].id?.toString() : '',
      size = 10,
      page = 1,
      address = '',
      registryNumber = '',
      name = '',
      identity = '',
      ownerName = '',
    },
  } = useCustomSearchParams()

  const isHead = user?.role === UserRoles.HEAD
  const canAssign = belongType === 'IRS' || belongType === 'XRAY' ? isHead : isRegional

  const { data, isLoading } = usePaginatedData<any>(
    '/preventions',
    {
      belongType,
      month,
      year,
      regionId,
      size,
      page,
      registryNumber,
      name,
      identity,
      ownerName,
      address,
      assigned: activeAssignedStatus == 'ALL' ? '' : activeAssignedStatus === 'ASSIGNED',
    },
    !!month && !!belongType && !!year
  )

  const handleView = (row: any) => {
    navigate(`/preventions/detail/${row.id}?tin=${row.identity}`)
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: () => (
        <div className="whitespace-nowrap">
          Roʻyxatga olish <br /> raqami
        </div>
      ),
      accessorKey: 'registryNumber',
      className: '!w-[1%] whitespace-nowrap',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.name'),
      accessorKey: 'name',
      filterKey: 'name',
      filterType: 'search',
    },
    {
      header: 'Tashkilot nomi',
      accessorKey: 'ownerName',
      filterKey: 'ownerName',
      filterType: 'search',
    },
    {
      accessorKey: 'identity',
      filterKey: 'identity',
      className: '!w-[1%]',
      header: () => <div className="whitespace-nowrap">Tashkilot STIR</div>,
      filterType: 'search',
    },
    {
      header: t('risk_analysis_columns.address'),
      accessorKey: 'address',
      filterKey: 'address',
      filterType: 'search',
    },
    ...(activeAssignedStatus === 'UNASSIGNED' && canAssign
      ? [
          {
            id: 'assignInspector',
            className: '!w-[1%]',
            header: 'Inspektorni belgilash',
            cell: ({ row }: any) => <AssignInspectorButton row={row.original} />,
          },
        ]
      : [
          {
            header: 'Inspektor',
            accessorKey: 'executorName',
            cell: ({ row }: any) =>
              row?.original?.executorName ? (
                row?.original?.executorName
              ) : canAssign ? (
                <AssignInspectorButton row={row.original} />
              ) : (
                'Inspektor biriktirilmagan'
              ),
          },
        ]),
    {
      id: 'status',
      header: 'Holati',
      className: '!w-[1%]',
      cell: ({ row }: any) =>
        row.original?.status ? (
          row.original?.status == 'CONDUCTED' ? (
            <Badge variant="success">Bajarilgan</Badge>
          ) : (
            <Badge variant="info">Yangi</Badge>
          )
        ) : (
          '-'
        ),
      meta: {
        className: 'w-[200px]',
      },
    },
    {
      id: 'actions',
      cell: ({ row }: any) => <DataTableRowActions showView onView={() => handleView(row.original)} row={row} />,
    },
  ]

  return (
    <>
      <DataTable isPaginated showFilters data={data || []} columns={columns} isLoading={isLoading} className="flex-1" />
      <AssignInspectorModal />
    </>
  )
}

export default PreventionTable

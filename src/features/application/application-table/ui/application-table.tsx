import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileWarning } from 'lucide-react'
import { ApplicationStatus, ApplicationStatusBadge } from '@/entities/application'
import { ApplicationCategory, APPLICATIONS_DATA } from '@/entities/create-application'
import { useApplicationList } from '@/features/application/application-table/hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { getDate } from '@/shared/utils/date'
import useData from '../../../../shared/hooks/api/useData'
import { API_ENDPOINTS } from '@/shared/api'
import { UserRoles } from '@/entities/user'

const ALLOWED_CATEGORIES: ApplicationCategory[] = [
  ApplicationCategory.HF,
  ApplicationCategory.EQUIPMENTS,
  ApplicationCategory.IRS,
  ApplicationCategory.XRAY,
]

export const ApplicationTable = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    paramsObject: { status = ApplicationStatus.ALL, mode, search = '', startDate = '', endDate = '', ...rest },
  } = useCustomSearchParams()

  const { data: applications = [], isLoading } = useApplicationList({
    ...rest,
    status: status !== ApplicationStatus.ALL ? status : '',
    search,
    mode,
    startDate,
    endDate,
  })

  const { data: officeSelect } = useData<any>(`${API_ENDPOINTS.OFFICES}/select`)
  const { data: executorOptions } = useData<any>(`${API_ENDPOINTS.USERS}/office-users/inspectors/select`)

  const handleViewApplication = (id: any) => {
    navigate(`/applications/detail/${id}`)
  }

  const appealTypeFilterOptions = useMemo(() => {
    return APPLICATIONS_DATA.filter((item) => item.category && ALLOWED_CATEGORIES.includes(item.category)).map(
      (item) => ({
        id: item.type,
        name: item.title,
      })
    )
  }, [])

  const columns: ExtendedColumnDef<any, any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'number',
        header: 'Ariza raqami',
        filterKey: 'search',
        filterType: 'search',
      },
      {
        header: 'Ariza sanasi',
        maxSize: 90,
        accessorFn: (row: any) => getDate(row.createdAt),
      },
      {
        header: 'Ariza turi',
        accessorKey: 'appealType',
        filterKey: 'appealType',
        filterType: 'select',
        filterOptions: appealTypeFilterOptions,
        cell: (cell: any) => APPLICATIONS_DATA.find((item) => item.type === cell.row.original.appealType)?.title || '',
      },
      ...((user?.role !== UserRoles.LEGAL && user?.role !== UserRoles.INDIVIDUAL
        ? [
            {
              accessorKey: 'ownerName',
              header: 'Arizachi tashkilot nomi',
              filterKey: 'ownerName',
              filterType: 'search',
            },
            {
              accessorKey: 'ownerIdentity',
              header: 'Arizachi STIR/JSHSHIR',
              filterKey: 'search',
              filterType: 'number',
              filterMaxLength: 14,
            },
          ]
        : []) as unknown as any),
      {
        accessorKey: 'officeName',
        header: 'Ijrochi hududiy boshqarma',
        filterKey: 'officeId',
        filterType: 'select',
        filterOptions: officeSelect || [],
      },
      {
        accessorKey: 'executorName',
        header: 'Maʼsul ijrochi',
        filterKey: 'executorId',
        filterType: 'select',
        filterOptions: executorOptions || [],
      },
      {
        header: 'Ijro muddati',
        maxSize: 90,
        accessorFn: (row: any) => getDate(row.deadline),
        filterKey: 'deadline',
        filterType: 'date-range',
      },
      {
        header: 'Ariza holati',
        cell: (cell: any) => (
          <div className="flex items-center gap-2">
            {ApplicationStatusBadge({
              status: cell.row.original.status,
            })}
            {cell.row.original.isRejected && (
              <span title="Rad etilgan fayl mavjud">
                <FileWarning size={18} className="text-yellow-200" />
              </span>
            )}
          </div>
        ),
      },
      {
        id: 'actions',
        maxSize: 40,
        cell: ({ row }: any) => (
          <DataTableRowActions
            showView
            showDelete
            row={row}
            onView={(row: any) => handleViewApplication(row?.original?.id)}
          />
        ),
      },
    ]
  }, [appealTypeFilterOptions, user, officeSelect, executorOptions])

  return (
    <DataTable
      showFilters
      isLoading={isLoading}
      isPaginated
      data={applications}
      columns={columns || []}
      className="h-[calc(100svh-220px)]"
    />
  )
}

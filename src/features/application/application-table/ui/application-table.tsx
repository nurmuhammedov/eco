import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileWarning } from 'lucide-react'
import { ApplicationStatus, ApplicationStatusBadge } from '@/entities/application'
import { applicationsList } from '@/entities/create-application'
import { useApplicationList } from '@/features/application/application-table/hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { getDate } from '@/shared/utils/date'
import useData from '../../../../shared/hooks/api/useData'
import { API_ENDPOINTS } from '@/shared/api'
import { UserRoles } from '@/entities/user'

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

  const columns: ExtendedColumnDef<any, any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'number',
        header: () => <div className="whitespace-nowrap">Ariza raqami</div>,
        className: '!w-[1%] whitespace-nowrap',
        filterKey: 'search',
        filterType: 'search',
      },
      {
        id: 'date',
        header: () => <div className="whitespace-nowrap">Ariza sanasi</div>,
        className: '!w-[1%]',
        accessorFn: (row: any) => getDate(row.createdAt),
      },
      {
        header: 'Ariza turi',
        accessorKey: 'appealType',
        filterKey: 'appealType',
        filterType: 'select',
        filterOptions: applicationsList?.map((i) => ({ id: i?.type, name: i?.title })),
        cell: (cell: any) => applicationsList.find((item) => item.type === cell.row.original.appealType)?.title || '',
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
              header: () => <div className="whitespace-nowrap">Arizachi STIR/JSHSHIR</div>,
              className: '!w-[1%]',
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
        id: 'deadline',
        accessorFn: (row: any) => getDate(row.deadline),
        header: () => <div className="whitespace-nowrap">Ijro muddati</div>,
        className: '!w-[1%]',
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
  }, [user, officeSelect, executorOptions])

  return <DataTable showFilters isLoading={isLoading} isPaginated data={applications} columns={columns || []} />
}

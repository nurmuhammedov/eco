import { SourceTypeBadge } from '@/entities/application/ui/source-type-badge'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ApplicationRow, ApplicationStatus, ApplicationStatusBadge } from '@/entities/application'
import { AppealReturnedMark } from '@/entities/application/ui/appeal-returned-mark'
import { getAppealTypeFilterOptions, getApplicationTitle, isKnownAppealType } from '@/entities/create-application'
import { useApplicationList } from '@/features/application/application-table/hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { getDate } from '@/shared/utils/date'
import useData from '../../../../shared/hooks/api/use-data'
import { API_ENDPOINTS } from '@/shared/api'
import { UserRoles } from '@/shared/types/user'
import type { OptionItem } from '@/shared/types/general'
import { RegistrationMode } from '../model/registration-mode'

export const ApplicationTable = ({ mode }: { mode: RegistrationMode }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  // The committee's own registrations are not appeals, so nothing here may call them one
  const isRegistration = mode === RegistrationMode.UNOFFICIAL

  const {
    // A mode left in an old link would cross the two lists, so the page's own one wins
    paramsObject: {
      status = ApplicationStatus.ALL,
      mode: _linkMode,
      search = '',
      startDate = '',
      endDate = '',
      ...rest
    },
  } = useCustomSearchParams()

  // An old link may carry a type the backend no longer accepts, and it would
  // fail the whole request, so unknown values are dropped
  const { appealType, ...restParams } = rest as Record<string, unknown>
  const safeAppealType = typeof appealType === 'string' && isKnownAppealType(appealType) ? appealType : undefined

  const { data: applications = [], isLoading } = useApplicationList({
    ...restParams,
    appealType: safeAppealType,
    status: status !== ApplicationStatus.ALL ? status : '',
    search,
    mode,
    startDate,
    endDate,
  })

  const { data: officeSelect } = useData<OptionItem<number>[]>(`${API_ENDPOINTS.OFFICES}/select`)
  const { data: executorOptions } = useData<OptionItem<string>[]>(
    `${API_ENDPOINTS.USERS}/office-users/inspectors/select`
  )

  const columns = useMemo((): ExtendedColumnDef<ApplicationRow>[] => {
    const ownerColumns: ExtendedColumnDef<ApplicationRow>[] = [
      {
        accessorKey: 'ownerName',
        header: isRegistration ? 'Tashkilot nomi' : 'Arizachi tashkilot nomi',
        filterKey: 'ownerName',
        filterType: 'search',
      },
      {
        accessorKey: 'ownerIdentity',
        header: isRegistration ? 'STIR/JSHSHIR' : 'Arizachi STIR/JSHSHIR',
        className: '!w-[1%]',
        filterKey: 'search',
        filterType: 'number',
        filterMaxLength: 14,
      },
    ]

    return [
      {
        accessorKey: 'number',
        header: () => (
          <div className="whitespace-nowrap">{isRegistration ? 'Ro‘yxatga olish raqami' : 'Ariza raqami'}</div>
        ),
        className: '!w-[1%] whitespace-nowrap',
        filterKey: 'search',
        filterType: 'search',
      },
      {
        id: 'date',
        header: () => (
          <div className="whitespace-nowrap">{isRegistration ? 'Ro‘yxatga olish sanasi' : 'Ariza sanasi'}</div>
        ),
        className: '!w-[1%]',
        accessorFn: (row) => getDate(row.createdAt),
      },
      {
        header: isRegistration ? 'Ro‘yxatga olish turi' : 'Ariza turi',
        accessorKey: 'appealType',
        filterKey: 'appealType',
        filterType: 'select',
        filterOptions: getAppealTypeFilterOptions(),
        // Auto layout shrinks a wrapping column to its longest word, so the
        // longest text in the table was living in the narrowest column and
        // stretching every row to five lines.
        cell: (cell) => (
          <div className="flex min-w-[165px] flex-col items-start gap-1">
            <SourceTypeBadge sourceType={cell.row.original.sourceType} />
            <span>{getApplicationTitle(cell.row.original.appealType)}</span>
          </div>
        ),
      },
      ...(user?.role !== UserRoles.LEGAL && user?.role !== UserRoles.INDIVIDUAL ? ownerColumns : []),
      {
        accessorKey: 'officeName',
        header: 'Ijrochi hududiy boshqarma',
        filterKey: 'officeId',
        filterType: 'select',
        filterOptions: officeSelect || [],
      },
      {
        accessorKey: 'executorName',
        header: 'Mas’ul ijrochi',
        filterKey: 'executorId',
        filterType: 'select',
        filterOptions: executorOptions || [],
      },
      {
        id: 'deadline',
        accessorFn: (row) => getDate(row.deadline),
        header: () => <div className="whitespace-nowrap">Ijro muddati</div>,
        className: '!w-[1%]',
        filterKey: 'deadline',
        filterType: 'date-range',
      },
      {
        header: isRegistration ? 'Holati' : 'Ariza holati',
        cell: (cell) => (
          <div className="flex items-center gap-1.5">
            {cell.row.original.status && <ApplicationStatusBadge status={cell.row.original.status} />}
            {cell.row.original.isRejected && <AppealReturnedMark />}
          </div>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DataTableRowActions
            showView
            showDelete
            row={row}
            onView={(row) => navigate(`/${isRegistration ? 'registrations' : 'applications'}/${row.original.id}`)}
          />
        ),
      },
    ]
  }, [user, officeSelect, executorOptions, navigate, isRegistration])

  return <DataTable showFilters isLoading={isLoading} isPaginated data={applications} columns={columns || []} />
}

import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import useDelete from '@/shared/hooks/api/use-delete'
import { UserRoles } from '@/shared/types/user'
import { CadastrePassportRow } from '../model/types'
import { isPreparer } from '../model/permissions'
import { STATUS_OPTIONS, StatusBadge } from './components/status-badge'
import { MyTasksTable } from './components/my-tasks-table'

const FILTER_KEYS = ['requestNumber', 'registryNumber', 'preparerTin', 'customerTin', 'status']

const COMMITTEE_STATUS = 'IN_COMMITTEE'

const TASKS_VIEW = 'tasks'
const ALL_VIEW = 'all'

const STATUS_IDS = STATUS_OPTIONS.map((option) => option.id)

interface CadastreListProps {
  customerTin?: string | number | null
  isShortView?: boolean
}

export default function CadastreList({ customerTin, isShortView }: CadastreListProps = {}) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    paramsObject: { page = 1, size = 10, view, ...rest },
    addParams,
  } = useCustomSearchParams()

  // A partner organisation's employee works off their own workflow queue; the
  // committee's queue is simply the passports that have reached it, and the
  // committee is the responsible manager.
  const isEmployee = !isShortView && user?.role === UserRoles.INDIVIDUAL
  const isCommittee = !isShortView && user?.role === UserRoles.MANAGER

  const showTasks = isEmployee || isCommittee
  const canCreate = !isShortView && user?.role === UserRoles.LEGAL

  /**
   * An employee's queue sits next to one tab per status, so a passport can be
   * found by where it stands rather than through the filter row. Everyone else
   * keeps a single list.
   */
  const tabs = [
    ...(showTasks ? [{ value: TASKS_VIEW, label: 'Mening ishlarim' }] : []),
    ...(isEmployee
      ? STATUS_OPTIONS.map((option) => ({ value: option.id, label: option.name }))
      : showTasks
        ? [{ value: ALL_VIEW, label: 'TXYUZ kadastr pasportlari' }]
        : []),
  ]

  const activeView = tabs.some((tab) => tab.value === view) ? view : (tabs[0]?.value ?? ALL_VIEW)

  const employeeQueue = isEmployee && activeView === TASKS_VIEW
  // Whichever tab pins the status: the committee's queue, or a status tab.
  const pinnedStatus =
    isCommittee && activeView === TASKS_VIEW ? COMMITTEE_STATUS : STATUS_IDS.includes(activeView) ? activeView : null

  const filters = Object.fromEntries(
    FILTER_KEYS.filter((key) => rest[key] && !(pinnedStatus && key === 'status')).map((key) => [key, rest[key]])
  )

  const { data, isLoading, refetch, totalPages } = usePaginatedData<CadastrePassportRow>(
    '/cadastre-passports',
    {
      page,
      size,
      ...filters,
      ...(pinnedStatus ? { status: pinnedStatus } : {}),
      ...(customerTin ? { customerTin } : {}),
    },
    !employeeQueue
  )

  const { mutate: deleteCadastre } = useDelete('/cadastre-passports')

  const columns: ExtendedColumnDef<CadastrePassportRow, any>[] = [
    {
      accessorKey: 'requestNumber',
      header: 'Ariza raqami',
      filterKey: 'requestNumber',
      filterType: 'search',
      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <span>{row.original.requestNumber || '-'}</span>
          {row.original.myTurn && <Badge variant="info">Sizning navbatingiz</Badge>}
        </div>
      ),
    },
    {
      accessorKey: 'registryNumber',
      header: 'Reyestr raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
      cell: ({ row }) => row.original.registryNumber || '-',
    },
    {
      accessorKey: 'preparerName',
      header: 'Ishlab chiqqan tashkilot',
      cell: ({ row }) => row.original.preparerName || '-',
    },
    {
      accessorKey: 'preparerTin',
      header: 'Ishlab chiqqan tashkilot STIR',
      filterKey: 'preparerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'customerName',
      header: 'Tashkilot nomi',
      cell: ({ row }) => row.original.customerName || '-',
    },
    {
      accessorKey: 'customerTin',
      header: 'Tashkilot STIR',
      filterKey: 'customerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      // The tab is the status filter whenever one pins it.
      ...(pinnedStatus ? {} : { filterKey: 'status', filterType: 'select', filterOptions: STATUS_OPTIONS }),
    },
    ...(isShortView
      ? []
      : [
          {
            id: 'actions',
            header: () => <div className="text-right">Amallar</div>,
            cell: ({ row }: any) => (
              <div className="flex justify-end">
                <DataTableRowActions
                  row={row}
                  showView
                  onView={(target: any) => navigate(`/cadastre-passport/${target.original.id}`)}
                  showDelete={row.original.status === 'NEW' && isPreparer(user, row.original)}
                  onDelete={(target: any) => deleteCadastre(target.original.id, { onSuccess: () => refetch() })}
                />
              </div>
            ),
          },
        ]),
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      {(showTasks || canCreate) && (
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {tabs.length ? (
            <Tabs value={activeView} onValueChange={(value) => addParams({ view: value }, 'page')}>
              <TabsList>
                {tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          ) : (
            <span />
          )}
          {canCreate && (
            <Button onClick={() => navigate('/cadastre-passport/add')}>
              <Plus className="mr-2 h-4 w-4" />
              TXYUZ kadastr pasporti qo‘shish
            </Button>
          )}
        </div>
      )}

      {employeeQueue ? (
        <MyTasksTable />
      ) : (
        <DataTable
          showFilters
          isPaginated
          data={data?.content || []}
          columns={columns as unknown as any}
          isLoading={isLoading}
          pageCount={totalPages}
          className="flex-1"
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks/api'
import { useCurrentRole } from '@/shared/hooks/use-current-role'
import { UserRoles } from '@/shared/types/user'
import {
  MYGOV_TASKS_ENDPOINT,
  RETRYABLE,
  SERVICE_TYPE_LABELS,
  STATUS_LABELS,
  useRetryMygovTask,
  type MygovServiceType,
  type MygovTask,
  type MygovTaskStatus,
} from '../model/mygov-tasks'

/** ISO without a zone (server local time) shown as dd.MM.yyyy HH:mm */
const formatDateTime = (value?: string | null) => {
  if (!value) return '—'
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return value
  const [, year, month, day, hour, minute] = match
  return `${day}.${month}.${year} ${hour}:${minute}`
}

const ErrorText = ({ text }: { text: string | null }) => {
  if (!text) return <span className="text-muted-foreground">—</span>

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="block max-w-[240px] cursor-pointer truncate text-left text-sm text-red-600 hover:underline"
          title="To‘liq matnni ko‘rish"
        >
          {text}
        </button>
      </PopoverTrigger>
      <PopoverContent className="max-w-md text-sm break-words whitespace-pre-wrap">{text}</PopoverContent>
    </Popover>
  )
}

const MygovTasksPage = () => {
  const role = useCurrentRole()
  const { paramsObject } = useCustomSearchParams()
  const retryMutation = useRetryMygovTask()
  // Which row is being retried: the request can take several seconds and must not go twice
  const [retryingId, setRetryingId] = useState<string | null>(null)

  const { data, isLoading, totalPages } = usePaginatedData<MygovTask>(MYGOV_TASKS_ENDPOINT, {
    page: 1,
    size: 10,
    ...paramsObject,
  })

  // The application page is not one of the administrator's
  const canOpenAppeal = role === UserRoles.CHAIRMAN

  const retry = (id: string) => {
    setRetryingId(id)
    retryMutation.mutate(id, { onSettled: () => setRetryingId(null) })
  }

  const columns: ExtendedColumnDef<MygovTask, unknown>[] = [
    {
      header: 'MyGov raqami',
      accessorKey: 'taskId',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.taskId}</span>,
    },
    {
      header: 'Turi',
      accessorKey: 'serviceType',
      filterKey: 'serviceType',
      filterType: 'select',
      filterOptions: (Object.keys(SERVICE_TYPE_LABELS) as MygovServiceType[]).map((type) => ({
        id: type,
        name: SERVICE_TYPE_LABELS[type],
      })),
      cell: ({ row }) => (
        <span className="text-sm">{SERVICE_TYPE_LABELS[row.original.serviceType] ?? row.original.serviceType}</span>
      ),
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      filterKey: 'status',
      filterType: 'select',
      filterOptions: (Object.keys(STATUS_LABELS) as MygovTaskStatus[]).map((status) => ({
        id: status,
        name: STATUS_LABELS[status].label,
      })),
      cell: ({ row }) => {
        const status = STATUS_LABELS[row.original.status]

        return status ? (
          <Badge variant="outline" className={`whitespace-nowrap ${status.className}`}>
            {status.label}
          </Badge>
        ) : (
          <span>{row.original.status}</span>
        )
      },
    },
    {
      header: 'Xatolik',
      accessorKey: 'errorMessage',
      cell: ({ row }) => <ErrorText text={row.original.errorMessage} />,
    },
    {
      header: 'To‘langan',
      accessorKey: 'isPaid',
      cell: ({ row }) =>
        row.original.isPaid ? <Badge variant="success">Ha</Badge> : <Badge variant="secondary">Yo‘q</Badge>,
    },
    {
      header: 'Ariza',
      accessorKey: 'appealId',
      cell: ({ row }) => {
        const { appealId } = row.original
        if (!appealId) return <span className="text-muted-foreground">—</span>

        return canOpenAppeal ? (
          <Link
            to={`/applications/${appealId}`}
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
          >
            Ochish
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        ) : (
          <span className="text-sm text-green-700">Yaratilgan</span>
        )
      },
    },
    {
      header: 'Kelgan vaqti',
      accessorKey: 'createdAt',
      filterType: 'date-range',
      filterRangeKeys: ['createdFrom', 'createdTo'],
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDateTime(row.original.createdAt)}</span>,
    },
    {
      header: 'O‘zgargan vaqti',
      accessorKey: 'updatedAt',
      filterType: 'date-range',
      filterRangeKeys: ['updatedFrom', 'updatedTo'],
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDateTime(row.original.updatedAt)}</span>,
    },
    {
      id: 'actions',
      header: 'Amal',
      cell: ({ row }) => {
        const task = row.original
        if (!RETRYABLE.includes(task.status)) return null

        const isRetrying = retryingId === task.id

        return (
          <Button
            variant="outline"
            size="sm"
            className="whitespace-nowrap"
            // One retry at a time: each holds a my.gov.uz call open
            disabled={!!retryingId}
            onClick={() => retry(task.id)}
          >
            {isRetrying ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-1.5 h-4 w-4" />
            )}
            Qayta yuborish
          </Button>
        )
      },
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-3">
        <h1 className="text-xl font-semibold text-gray-800">MyGov so‘rovlari</h1>
        <p className="text-muted-foreground text-sm">
          my.gov.uz orqali kelgan so‘rovlar va ularning holati. Xatolik holatidagi so‘rovni qayta yuborish mumkin.
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        isPaginated
        pageCount={totalPages}
        showFilters
        showNumeration
        className="flex-1"
      />
    </div>
  )
}

export default MygovTasksPage

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { useCustomSearchParams, useServicesPaginatedData } from '@/shared/hooks/api'
import { paramText } from '@/shared/lib/url-params'
import { cn } from '@/shared/lib/utils'
import {
  ATTENDANCE_LOGS_ENDPOINT,
  type AttendanceFilters,
  type AttendanceLog,
  type AttendanceStatus,
} from '../api/attendance.api'
import {
  cellClassName,
  formatDate,
  formatHours,
  INCOMPLETE_REASON_LABELS,
  LOG_STATUSES,
  monthRange,
  STATUS_LABELS,
} from '../model/attendance-labels'
import { useAttendanceAccess } from '../model/use-attendance'
import { CorrectionDialog, type CorrectionTarget } from './correction-dialog'

interface LogsTableProps {
  filters: AttendanceFilters
  /** Only the days in this status, without the status filter */
  status?: AttendanceStatus
  actionLabel?: string
}

/**
 * The daily log (Dasturchi_Log): a row per employee and day, newest first.
 * Without a date filter it covers the month picked above.
 */
export const LogsTable = ({ filters, status, actionLabel = 'Tuzatish' }: LogsTableProps) => {
  const { canManage } = useAttendanceAccess()
  const { paramsObject } = useCustomSearchParams()
  const [correcting, setCorrecting] = useState<CorrectionTarget | null>(null)

  const range = monthRange(filters.year, filters.month)
  const size = paramText(paramsObject.size, '20')
  const { data, isLoading, totalPages } = useServicesPaginatedData<AttendanceLog>(ATTENDANCE_LOGS_ENDPOINT, {
    date_from: paramText(paramsObject.date_from) || range.from,
    date_to: paramText(paramsObject.date_to) || range.to,
    division: filters.division || undefined,
    status: status ?? (paramText(paramsObject.status) || undefined),
    late: paramText(paramsObject.late) || undefined,
    search: paramText(paramsObject.search) || undefined,
    page: paramText(paramsObject.page, '1'),
    per_page: size,
  })

  const columns: ExtendedColumnDef<AttendanceLog, unknown>[] = [
    {
      header: 'Sana',
      accessorKey: 'date',
      filterType: 'date-range',
      filterRangeKeys: ['date_from', 'date_to'],
      cell: ({ row }) => <span className="whitespace-nowrap">{formatDate(row.original.date)}</span>,
    },
    {
      header: 'Xodim',
      accessorKey: 'name',
      filterKey: 'search',
      filterType: 'search',
      cell: ({ row }) => (
        <div className="min-w-0">
          <Link
            to={`/attendance/employees/${row.original.user_id}?year=${row.original.date.slice(0, 4)}&month=${Number(row.original.date.slice(5, 7))}`}
            className="font-medium text-[#0271FF] hover:underline"
          >
            {row.original.name}
          </Link>
          <p className="text-muted-foreground text-xs">{row.original.division_name}</p>
        </div>
      ),
    },
    {
      header: 'Kelgan',
      accessorKey: 'check_in',
      cell: ({ row }) => row.original.check_in ?? '—',
    },
    {
      header: 'Ketgan',
      accessorKey: 'check_out',
      cell: ({ row }) => row.original.check_out ?? '—',
    },
    {
      header: 'Ishlagan soat',
      accessorKey: 'hours',
      cell: ({ row }) => (row.original.status === 'PRESENT' ? formatHours(row.original.hours) : '—'),
    },
    {
      header: 'Kechikish',
      accessorKey: 'late_minutes',
      filterKey: 'late',
      filterType: 'select',
      filterOptions: [{ id: '1', name: 'Kech qolganlar' }],
      cell: ({ row }) =>
        row.original.late_minutes ? (
          <span className="font-medium text-red-600">{row.original.late_minutes} daq.</span>
        ) : (
          '—'
        ),
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      ...(status
        ? {}
        : {
            filterKey: 'status',
            filterType: 'select' as const,
            filterOptions: LOG_STATUSES.map((item) => ({ id: item, name: STATUS_LABELS[item] })),
          }),
      cell: ({ row }) => {
        const log = row.original

        return (
          <div className="flex flex-col gap-0.5">
            <span
              className={cn(
                'inline-flex w-fit items-center gap-1 rounded-md border px-2 py-0.5 text-xs',
                cellClassName(log.status, log.flag) || 'bg-white'
              )}
            >
              {log.code && log.status !== 'PRESENT' && <b>{log.code}</b>}
              {log.status === 'PRESENT' && log.late_minutes > 0 ? 'Kech qolgan' : STATUS_LABELS[log.status]}
            </span>
            {log.incomplete_reason && (
              <span className="text-xs text-orange-600">{INCOMPLETE_REASON_LABELS[log.incomplete_reason]}</span>
            )}
            {log.corrected && <span className="text-xs text-blue-600">HR tuzatgan</span>}
          </div>
        )
      },
    },
    {
      header: 'Izoh',
      accessorKey: 'note',
      cell: ({ row }) => <span className="line-clamp-2 max-w-[260px] text-xs">{row.original.note ?? ''}</span>,
    },
    ...(canManage
      ? [
          {
            id: 'actions',
            header: 'Amallar',
            cell: ({ row }: { row: { original: AttendanceLog } }) => (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setCorrecting({
                    userId: row.original.user_id,
                    name: row.original.name,
                    date: row.original.date,
                    status: row.original.status,
                    checkIn: row.original.check_in,
                    checkOut: row.original.check_out,
                  })
                }
              >
                <Pencil className="mr-1.5 size-3.5" />
                {actionLabel}
              </Button>
            ),
          } as ExtendedColumnDef<AttendanceLog, unknown>,
        ]
      : []),
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        isPaginated
        pageCount={totalPages}
        defaultPageSize={20}
        showFilters
        className="flex-1"
      />
      <CorrectionDialog target={correcting} onClose={() => setCorrecting(null)} />
    </>
  )
}

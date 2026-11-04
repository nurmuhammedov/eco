import { useState } from 'react'
import { format, isBefore, parseISO, startOfToday } from 'date-fns'
import { Eye } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import {
  DIRECTION,
  DIRECTION_OPTIONS,
  EMPLOYEE_TYPE,
  REQUEST_STATUS,
  REQUEST_STATUS_OPTIONS,
} from '@/entities/attestation/model/labels'
import type { AttestationRequest } from '@/entities/attestation/model/types'
import { RequestDialog } from './request-dialog'

const date = (value?: string | null) => (value ? format(parseISO(value), 'dd.MM.yyyy') : '-')

/**
 * Requests that reached the commission: leaders' for the department, the
 * region's engineers' for a regional head. Each is admitted or rejected as a
 * whole within three working days.
 */
export const RequestsList = () => {
  const { paramsObject } = useCustomSearchParams()
  const [opened, setOpened] = useState<AttestationRequest | null>(null)

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationRequest>(
    SERVICES_API_ENDPOINTS.REQUESTS,
    { ...paramsObject }
  )

  const columns: ExtendedColumnDef<AttestationRequest, unknown>[] = [
    {
      header: 'Tashkilot',
      accessorKey: 'organization_name',
      filterKey: 'search',
      filterType: 'search',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.organization_name}</p>
          <p className="text-muted-foreground text-xs">{row.original.organization_tin}</p>
        </div>
      ),
    },
    {
      header: 'Yo‘nalish',
      accessorKey: 'direction',
      filterKey: 'direction',
      filterType: 'select',
      filterOptions: DIRECTION_OPTIONS.map((option) => ({ id: option.value, name: option.label })),
      cell: ({ row }) => DIRECTION[row.original.direction] ?? row.original.direction,
    },
    {
      header: 'Xodim turi',
      accessorKey: 'employee_type',
      cell: ({ row }) => {
        const type = EMPLOYEE_TYPE[row.original.employee_type]

        return (
          <Badge variant="outline" className={type.className}>
            {type.label}
          </Badge>
        )
      },
    },
    {
      header: 'Xodimlar',
      accessorKey: 'applications_count',
      cell: ({ row }) => row.original.applications_count ?? 0,
    },
    {
      header: 'Yuborilgan',
      accessorKey: 'created_at',
      cell: ({ row }) => date(row.original.created_at),
    },
    {
      header: 'Muddat / qaror',
      accessorKey: 'decision_due_at',
      cell: ({ row }) => {
        const item = row.original

        if (item.decision_number) {
          return (
            <div>
              <p>{item.decision_number}-son</p>
              <p className="text-muted-foreground text-xs">{date(item.decided_at)}</p>
            </div>
          )
        }

        const isOverdue = !!item.decision_due_at && isBefore(parseISO(item.decision_due_at), startOfToday())

        return <span className={isOverdue ? 'font-medium text-red-600' : undefined}>{date(item.decision_due_at)}</span>
      },
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      filterKey: 'status',
      filterType: 'select',
      filterOptions: REQUEST_STATUS_OPTIONS,
      cell: ({ row }) => {
        const cfg = REQUEST_STATUS[row.original.status]

        return cfg ? <Badge variant={cfg.variant}>{cfg.label}</Badge> : <span>{row.original.status_label}</span>
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-500"
          title="Ko‘rib chiqish"
          onClick={() => setOpened(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        isPaginated
        pageCount={totalPages}
        showFilters
        className="flex-1"
      />

      <RequestDialog request={opened} audience="commission" onClose={() => setOpened(null)} />
    </div>
  )
}

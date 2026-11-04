import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { Eye, Plus } from 'lucide-react'
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
import { SubmitRequestModal } from './submit-request-modal'

/** The organization's requests; each one opens with its employees, decision and documents */
export const MyRequestsList = () => {
  const { paramsObject } = useCustomSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationRequest>(
    SERVICES_API_ENDPOINTS.MY_REQUESTS,
    { ...paramsObject }
  )

  // Read from the list on every render, so a refreshed list refreshes the dialog too
  const opened = data?.content?.find((item) => item.id === openId) ?? null

  const columns: ExtendedColumnDef<AttestationRequest, unknown>[] = [
    {
      header: 'Yuborilgan sana',
      accessorKey: 'created_at',
      cell: ({ row }) => (row.original.created_at ? format(parseISO(row.original.created_at), 'dd.MM.yyyy') : '-'),
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
      cell: ({ row }) => row.original.applications_count ?? row.original.applications?.length ?? 0,
    },
    {
      header: 'Qaror',
      accessorKey: 'decision_number',
      cell: ({ row }) =>
        row.original.decision_number ? (
          <div>
            <p>{row.original.decision_number}-son</p>
            <p className="text-muted-foreground text-xs">
              {row.original.decided_at ? format(parseISO(row.original.decided_at), 'dd.MM.yyyy') : ''}
            </p>
          </div>
        ) : (
          <span className="text-muted-foreground text-xs">Kutilmoqda</span>
        ),
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
          title="Ko‘rish"
          onClick={() => setOpenId(row.original.id)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex justify-end">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ariza berish
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        isLoading={isLoading}
        isPaginated
        pageCount={totalPages}
        showFilters
        className="flex-1"
      />

      <SubmitRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <RequestDialog request={opened} audience="organization" onClose={() => setOpenId(null)} />
    </div>
  )
}

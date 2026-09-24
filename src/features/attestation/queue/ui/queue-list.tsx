import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { AlertCircle, CalendarPlus, X } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { DIRECTION, DIRECTION_OPTIONS, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationApplication } from '@/entities/attestation/model/types'
import { ExamModal } from '@/features/attestation/exams/ui/exam-modal'

/**
 * Applications waiting for an exam. The department picks several - across
 * organizations if it likes - and sets one date for all of them.
 */
export const QueueList = () => {
  const { paramsObject } = useCustomSearchParams()
  const [selected, setSelected] = useState<Map<string, AttestationApplication>>(new Map())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationApplication>(
    SERVICES_API_ENDPOINTS.APPLICATIONS,
    { ...paramsObject, status: 'NEW' }
  )

  const rows = useMemo(() => data?.content ?? [], [data])

  // Kept across pages and filters, so it is keyed by id rather than by row
  const picked = useMemo(() => [...selected.values()], [selected])
  const isMixed = new Set(picked.map((application) => application.employee_type)).size > 1

  const toggle = (items: AttestationApplication[], checked: boolean) =>
    setSelected((current) => {
      const next = new Map(current)
      items.forEach((item) => (checked ? next.set(item.id, item) : next.delete(item.id)))

      return next
    })

  const pageState = (() => {
    const count = rows.filter((row) => selected.has(row.id)).length

    if (count === 0) return false
    return count === rows.length ? true : 'indeterminate'
  })()

  const columns: ExtendedColumnDef<AttestationApplication, unknown>[] = [
    {
      id: 'select',
      enableSorting: false,
      header: () => (
        <Checkbox
          checked={pageState}
          disabled={rows.length === 0}
          onCheckedChange={(value) => toggle(rows, value === true)}
          aria-label="Sahifadagi barcha arizalarni tanlash"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selected.has(row.original.id)}
          onCheckedChange={(value) => toggle([row.original], value === true)}
          aria-label="Arizani tanlash"
        />
      ),
    },
    {
      header: 'Xodim',
      accessorKey: 'employee_name',
      filterKey: 'search',
      filterType: 'search',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.employee_name}</p>
          <p className="text-muted-foreground text-xs">{row.original.employee_pin}</p>
        </div>
      ),
    },
    {
      header: 'Tashkilot',
      accessorKey: 'organization_name',
      cell: ({ row }) => (
        <div>
          <p>{row.original.organization_name}</p>
          <p className="text-muted-foreground text-xs">{row.original.organization_tin}</p>
        </div>
      ),
    },
    {
      header: 'Lavozimi',
      accessorKey: 'employee_position',
      cell: ({ row }) => row.original.employee_position || '-',
    },
    {
      header: 'Xodim turi',
      accessorKey: 'employee_type',
      filterKey: 'employee_type',
      filterType: 'select',
      filterOptions: [
        { id: 'LEADER', name: EMPLOYEE_TYPE.LEADER.label },
        { id: 'ENGINEER', name: EMPLOYEE_TYPE.ENGINEER.label },
      ],
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
      header: 'Yo‘nalish',
      accessorKey: 'direction',
      filterKey: 'direction',
      filterType: 'select',
      filterOptions: DIRECTION_OPTIONS.map((option) => ({ id: option.value, name: option.label })),
      cell: ({ row }) => DIRECTION[row.original.direction] ?? row.original.direction,
    },
    {
      header: 'Yuborilgan',
      accessorKey: 'created_at',
      cell: ({ row }) => (row.original.created_at ? format(parseISO(row.original.created_at), 'dd.MM.yyyy') : '-'),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
        {picked.length > 0 && (
          <>
            {isMixed ? (
              <span className="flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                Bitta imtihonga faqat bir xil turdagi xodimlar kiritiladi
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">Tanlandi: {picked.length}</span>
            )}

            <Button variant="ghost" size="sm" onClick={() => setSelected(new Map())}>
              <X className="mr-1 h-4 w-4" />
              Tozalash
            </Button>
          </>
        )}

        <Button onClick={() => setIsModalOpen(true)} disabled={picked.length === 0 || isMixed}>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Imtihon belgilash
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

      <ExamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applications={picked}
        onCreated={() => setSelected(new Map())}
      />
    </div>
  )
}

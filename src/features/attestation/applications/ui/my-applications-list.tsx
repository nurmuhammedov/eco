import { useState } from 'react'
import { Plus, Video } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { APPLICATION_STATUS, DIRECTION, DIRECTION_OPTIONS, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationApplication } from '@/entities/attestation/model/types'
import { formatExamDate, formatExamHours } from '@/entities/attestation/lib/exam-time'
import { CreateApplicationModal } from './create-application-modal'

export const MyApplicationsList = () => {
  const { paramsObject } = useCustomSearchParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationApplication>(
    SERVICES_API_ENDPOINTS.MY_APPLICATIONS,
    { ...paramsObject }
  )

  const columns: ExtendedColumnDef<AttestationApplication, unknown>[] = [
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
      header: 'Lavozimi',
      accessorKey: 'employee_position',
      cell: ({ row }) => row.original.employee_position || '-',
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
      header: 'Yo‘nalish',
      accessorKey: 'direction',
      filterKey: 'direction',
      filterType: 'select',
      filterOptions: DIRECTION_OPTIONS.map((option) => ({ id: option.value, name: option.label })),
      cell: ({ row }) => DIRECTION[row.original.direction] ?? row.original.direction,
    },
    {
      header: 'Imtihon vaqti',
      accessorKey: 'attestation_calendar_id',
      cell: ({ row }) => {
        const calendar = row.original.calendar

        // Set by the department once it puts the application into an exam
        if (!calendar) return <span className="text-muted-foreground text-xs">Belgilanmagan</span>

        return (
          <div>
            <p>{formatExamDate(calendar)}</p>
            <p className="text-muted-foreground text-xs">{formatExamHours(calendar)}</p>
          </div>
        )
      },
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      filterKey: 'status',
      filterType: 'select',
      filterOptions: Object.entries(APPLICATION_STATUS).map(([id, cfg]) => ({ id, name: cfg.label })),
      cell: ({ row }) => {
        const cfg = APPLICATION_STATUS[row.original.status]

        return cfg ? <Badge variant={cfg.variant}>{cfg.label}</Badge> : <span>{row.original.status_label}</span>
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const calendar = row.original.calendar

        return (
          <div className="flex items-center gap-1">
            {/* Kept through the interview too, in case the employee drops out of the call */}
            {calendar?.zoom_join_url && ['ASSIGNED', 'SCHEDULED'].includes(row.original.status) && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Zoomga kirish" asChild>
                <a href={calendar.zoom_join_url} target="_blank" rel="noreferrer">
                  <Video className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )
      },
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

      <CreateApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

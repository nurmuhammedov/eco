import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarPlus, Edit2, Users, Video } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { CALENDAR_STATUS, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationCalendar } from '@/entities/attestation/model/types'
import { formatExamDate, formatExamHours } from '@/entities/attestation/lib/exam-time'
import { useDeleteExam } from '../model/use-calendars'
import { CalendarModal } from './calendar-modal'

export const CalendarsList = () => {
  const navigate = useNavigate()
  const { paramsObject } = useCustomSearchParams()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<AttestationCalendar | null>(null)

  const deleteMutation = useDeleteExam()

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationCalendar>(
    SERVICES_API_ENDPOINTS.CALENDARS,
    { ...paramsObject }
  )

  const columns: ExtendedColumnDef<AttestationCalendar, unknown>[] = [
    {
      header: 'Sana',
      accessorKey: 'start_date',
      filterKey: 'startDate',
      filterType: 'date-range',
      cell: ({ row }) => <span className="font-medium">{formatExamDate(row.original)}</span>,
    },
    {
      header: 'Vaqti',
      accessorKey: 'end_date',
      cell: ({ row }) => <span>{formatExamHours(row.original)}</span>,
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
      header: 'Ishtirokchilar',
      accessorKey: 'applications_count',
      cell: ({ row }) => <span className="font-medium">{row.original.applications_count ?? 0} ta</span>,
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      filterKey: 'status',
      filterType: 'select',
      filterOptions: [
        { id: 'OPEN', name: CALENDAR_STATUS.OPEN.label },
        { id: 'IN_PROGRESS', name: CALENDAR_STATUS.IN_PROGRESS.label },
        { id: 'CLOSED', name: CALENDAR_STATUS.CLOSED.label },
      ],
      cell: ({ row }) => {
        const cfg = CALENDAR_STATUS[row.original.status]

        return cfg ? <Badge variant={cfg.variant}>{cfg.label}</Badge> : <span>{row.original.status}</span>
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => {
        const calendar = row.original
        // Once an interview has started the exam stays as it is
        const isEditable = calendar.status === 'OPEN'

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Ishtirokchilar"
              onClick={() => navigate(`/attestation/exams/${calendar.id}`)}
            >
              <Users className="h-4 w-4" />
            </Button>

            {calendar.zoom_start_url && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500" title="Zoomda boshlash" asChild>
                <a href={calendar.zoom_start_url} target="_blank" rel="noreferrer">
                  <Video className="h-4 w-4" />
                </a>
              </Button>
            )}

            {isEditable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-orange-500"
                title="Tahrirlash"
                onClick={() => {
                  setEditItem(calendar)
                  setIsModalOpen(true)
                }}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}

            {isEditable && (
              <DeleteConfirmationDialog
                title="Imtihonni o‘chirish"
                description="Zoom uchrashuvi bekor qilinadi, arizalar esa navbatga qaytadi."
                onConfirm={() => deleteMutation.mutate(calendar.id)}
              />
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex justify-end">
        {/* An exam is built from queued applications, so it starts from the queue */}
        <Button onClick={() => navigate('/attestation/queue')}>
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

      <CalendarModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditItem(null)
        }}
        editData={editItem}
      />
    </div>
  )
}

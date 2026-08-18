import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Edit2, Lock, Plus, Users, Video } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Progress } from '@/shared/components/ui/progress'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { cn } from '@/shared/lib/utils'
import { CALENDAR_STATUS, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationCalendar } from '@/entities/attestation/model/types'
import { useCloseCalendar, useDeleteCalendar } from '../model/use-calendars'
import { CalendarModal } from './calendar-modal'

export const CalendarsList = () => {
  const navigate = useNavigate()
  const { paramsObject } = useCustomSearchParams()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<AttestationCalendar | null>(null)

  const deleteMutation = useDeleteCalendar()
  const closeMutation = useCloseCalendar()

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationCalendar>(
    SERVICES_API_ENDPOINTS.CALENDARS,
    { ...paramsObject }
  )

  const openCreate = () => {
    setEditItem(null)
    setIsModalOpen(true)
  }

  const columns: ExtendedColumnDef<AttestationCalendar, unknown>[] = [
    {
      header: 'Sana',
      accessorKey: 'start_date',
      filterKey: 'startDate',
      filterType: 'date-range',
      cell: ({ row }) => <span className="font-medium">{format(parseISO(row.original.start_date), 'dd.MM.yyyy')}</span>,
    },
    {
      header: 'Vaqti',
      accessorKey: 'end_date',
      cell: ({ row }) => (
        <span>
          {format(parseISO(row.original.start_date), 'HH:mm')} – {format(parseISO(row.original.end_date), 'HH:mm')}
        </span>
      ),
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
      header: 'Band joylar',
      accessorKey: 'capacity',
      cell: ({ row }) => {
        const taken = row.original.capacity - row.original.remaining_capacity
        const filled = row.original.capacity > 0 ? (taken / row.original.capacity) * 100 : 0

        return (
          <div className="flex w-[140px] items-center gap-2">
            <Progress
              value={filled}
              className={cn('h-1.5 flex-1', filled >= 100 ? '[&>div]:bg-red-500' : '[&>div]:bg-green-600')}
            />
            <span className="shrink-0 text-xs font-medium">
              {taken} / {row.original.capacity}
            </span>
          </div>
        )
      },
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
        const taken = calendar.capacity - calendar.remaining_capacity
        // Once an application is in, the session may only be closed
        const isEditable = calendar.status === 'OPEN' && taken === 0

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Arizachilar"
              onClick={() => navigate(`/attestation-calendars/${calendar.id}/applicants`)}
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

            {calendar.status === 'OPEN' && (
              <DeleteConfirmationDialog
                title="Qabulni yopish"
                description="Yopilgandan keyin bu vaqtga yangi ariza qabul qilinmaydi."
                confirmText="Yopish"
                onConfirm={() => closeMutation.mutate(calendar.id)}
                trigger={
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Qabulni yopish">
                    <Lock className="h-4 w-4" />
                  </Button>
                }
              />
            )}

            {isEditable && (
              <DeleteConfirmationDialog
                title="Qabul vaqtini o‘chirish"
                description="Ushbu qabul vaqtini o‘chirmoqchimisiz? Zoom uchrashuvi ham bekor qilinadi."
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
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Yangi qo‘shish
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

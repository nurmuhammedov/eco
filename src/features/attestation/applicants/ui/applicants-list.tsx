import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Eye, Plus, Undo2, Video } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import GoBack from '@/shared/components/common/go-back'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { APPLICATION_STATUS, CALENDAR_STATUS, DIRECTION, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationApplication } from '@/entities/attestation/model/types'
import { formatExamTime } from '@/entities/attestation/lib/exam-time'
import { useDetachApplication } from '@/features/attestation/calendars/model/use-calendars'
import { useCalendar } from '../model/use-applicants'
import { AddApplicationsDialog } from './add-applications-dialog'
import { ExamVideo } from './exam-video'

export const ApplicantsList = () => {
  const { calendarId = '' } = useParams()
  const navigate = useNavigate()
  const { paramsObject } = useCustomSearchParams()
  const [isAddOpen, setIsAddOpen] = useState(false)

  const { data: calendar } = useCalendar(calendarId)
  const detach = useDetachApplication()

  const { data, isLoading, totalPages } = useServicesPaginatedData<AttestationApplication>(
    SERVICES_API_ENDPOINTS.CALENDAR_APPLICANTS(calendarId),
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
      header: 'Yo‘nalish',
      accessorKey: 'direction',
      cell: ({ row }) => DIRECTION[row.original.direction] ?? row.original.direction,
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      filterKey: 'status',
      filterType: 'select',
      filterOptions: (['ASSIGNED', 'SCHEDULED', 'PASSED', 'FAILED'] as const).map((id) => ({
        id,
        name: APPLICATION_STATUS[id].label,
      })),
      cell: ({ row }) => {
        const cfg = APPLICATION_STATUS[row.original.status]

        return cfg ? <Badge variant={cfg.variant}>{cfg.label}</Badge> : <span>{row.original.status_label}</span>
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500"
            title="Suhbat sahifasi"
            onClick={() => navigate(`/attestation-applications/${row.original.id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>

          {/* Also how a no-show is taken out, so the exam can still close */}
          {row.original.status === 'ASSIGNED' && (
            <DeleteConfirmationDialog
              title="Arizani navbatga qaytarish"
              description="Xodim bu imtihondan chiqariladi va keyingi imtihonga kiritilishini kutadi."
              confirmText="Qaytarish"
              onConfirm={() => detach.mutate({ id: calendarId, applicationId: row.original.id })}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500" title="Navbatga qaytarish">
                  <Undo2 className="h-4 w-4" />
                </Button>
              }
            />
          )}
        </div>
      ),
    },
  ]

  const statusCfg = calendar ? CALENDAR_STATUS[calendar.status] : null

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <GoBack title={calendar ? formatExamTime(calendar) : 'Imtihon'} fallbackPath="/attestation-calendars" />

        {calendar && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={EMPLOYEE_TYPE[calendar.employee_type].className}>
              {EMPLOYEE_TYPE[calendar.employee_type].label}
            </Badge>
            {statusCfg && <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>}
          </div>
        )}

        {calendar && (
          <div className="ml-auto flex flex-wrap items-start gap-2">
            {calendar.zoom_start_url && (
              <Button variant="outline" asChild>
                <a href={calendar.zoom_start_url} target="_blank" rel="noreferrer">
                  <Video className="mr-2 h-4 w-4 text-blue-500" />
                  Zoomda boshlash
                </a>
              </Button>
            )}

            {calendar.status === 'OPEN' && (
              <Button variant="outline" onClick={() => setIsAddOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ariza qo‘shish
              </Button>
            )}

            <ExamVideo calendar={calendar} />
          </div>
        )}
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

      {calendar && <AddApplicationsDialog calendar={calendar} isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />}
    </div>
  )
}

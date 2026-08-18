import { useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format, parseISO } from 'date-fns'
import { Eye, FileVideo, Loader2, Upload } from 'lucide-react'
import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import GoBack from '@/shared/components/common/go-back'
import { useServicesPaginatedData, useCustomSearchParams } from '@/shared/hooks/api'
import { SERVICES_API_ENDPOINTS } from '@/shared/api/endpoints'
import { apiConfig } from '@/shared/api/constants'
import { APPLICATION_STATUS, CALENDAR_STATUS, DIRECTION, EMPLOYEE_TYPE } from '@/entities/attestation/model/labels'
import type { AttestationApplication } from '@/entities/attestation/model/types'
import { useCalendar, useUploadSessionVideo } from '../model/use-applicants'

export const ApplicantsList = () => {
  const { calendarId = '' } = useParams()
  const navigate = useNavigate()
  const { paramsObject } = useCustomSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: calendar } = useCalendar(calendarId)
  const uploadVideo = useUploadSessionVideo()

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
      filterOptions: Object.entries(APPLICATION_STATUS).map(([id, cfg]) => ({ id, name: cfg.label })),
      cell: ({ row }) => {
        const cfg = APPLICATION_STATUS[row.original.status]

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
          title="Suhbat sahifasi"
          onClick={() => navigate(`/attestation-applications/${row.original.id}`)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const statusCfg = calendar ? CALENDAR_STATUS[calendar.status] : null

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <GoBack
          title={
            calendar
              ? `${format(parseISO(calendar.start_date), 'dd.MM.yyyy')} · ${format(
                  parseISO(calendar.start_date),
                  'HH:mm'
                )}–${format(parseISO(calendar.end_date), 'HH:mm')}`
              : 'Arizachilar'
          }
          fallbackPath="/attestation-calendars"
        />

        {calendar && (
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={EMPLOYEE_TYPE[calendar.employee_type].className}>
              {EMPLOYEE_TYPE[calendar.employee_type].label}
            </Badge>
            {statusCfg && <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          {calendar?.has_video && calendar.video_url && (
            <Button variant="ghost" size="sm" asChild>
              <a
                href={`${String(apiConfig.servicesURL ?? '').replace(/\/$/, '')}${calendar.video_url}`}
                target="_blank"
                rel="noreferrer"
              >
                <FileVideo className="mr-2 h-4 w-4" />
                Videoni ko‘rish
              </a>
            </Button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]

              if (file) {
                uploadVideo.mutate({ calendarId, file })
              }

              event.target.value = ''
            }}
          />

          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploadVideo.isPending}>
            {uploadVideo.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {calendar?.has_video ? 'Videoni almashtirish' : 'Video yuklash'}
          </Button>
        </div>
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
    </div>
  )
}

import { DataTable, ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomSearchParams, useServicesPaginatedData } from '@/shared/hooks/api'
import { SKUD_EVENTS_ENDPOINT, type SkudEvent } from '../api/skud.api'
import { useSkudDevices, useSkudRegions } from '../model/use-skud'
import { DIRECTION_BADGE, DIRECTION_LABELS, formatDateTime } from './skud-labels'

export const SkudEventsTab = () => {
  const { paramsObject } = useCustomSearchParams()
  const { data: regions = [] } = useSkudRegions()
  const { data: devices = [] } = useSkudDevices()

  // The tab switch lives in the same query string; Laravel pages by per_page
  const { tab: _tab, size, ...filters } = paramsObject
  const { data, isLoading, totalPages } = useServicesPaginatedData<SkudEvent>(SKUD_EVENTS_ENDPOINT, {
    ...filters,
    size,
    per_page: size ?? 10,
  })

  const columns: ExtendedColumnDef<SkudEvent, unknown>[] = [
    {
      header: 'Vaqti',
      accessorKey: 'time',
      filterType: 'date-range',
      filterRangeKeys: ['date_from', 'date_to'],
      cell: ({ row }) => <span className="font-medium whitespace-nowrap">{formatDateTime(row.original.time)}</span>,
    },
    {
      header: 'Yo‘nalishi',
      accessorKey: 'direction',
      filterKey: 'direction',
      filterType: 'select',
      filterOptions: [
        { id: 'in', name: DIRECTION_LABELS.in },
        { id: 'out', name: DIRECTION_LABELS.out },
      ],
      cell: ({ row }) => (
        <Badge variant={DIRECTION_BADGE[row.original.direction]}>{DIRECTION_LABELS[row.original.direction]}</Badge>
      ),
    },
    {
      header: 'Xodim',
      accessorKey: 'person_name',
      filterKey: 'search',
      filterType: 'search',
      cell: ({ row }) => {
        const event = row.original

        return (
          <div className="min-w-0">
            <p className="truncate font-medium">{event.user?.name ?? event.person_name ?? '—'}</p>
            {/* An Employee No. nobody is linked to yet */}
            {!event.user && <p className="text-xs text-orange-500">Xodimga bog‘lanmagan</p>}
          </div>
        )
      },
    },
    {
      header: 'Qurilmadagi raqami',
      accessorKey: 'person_no',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.person_no}</span>,
    },
    {
      header: 'Hudud',
      accessorKey: 'region',
      filterKey: 'region_id',
      filterType: 'select',
      filterOptions: regions.map((region) => ({ id: region.id, name: region.name })),
      cell: ({ row }) => <span>{row.original.region?.name ?? '—'}</span>,
    },
    {
      header: 'Qurilma',
      accessorKey: 'device',
      filterKey: 'device_id',
      filterType: 'select',
      filterOptions: devices.map((device) => ({ id: device.id, name: device.name ?? device.id })),
      cell: ({ row }) => <span>{row.original.device?.name ?? '—'}</span>,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={data || []}
      isLoading={isLoading}
      isPaginated
      pageCount={totalPages}
      showFilters
      className="flex-1"
    />
  )
}

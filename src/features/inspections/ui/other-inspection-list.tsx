import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams'
import { Eye } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table.tsx'
import { useTranslation } from 'react-i18next'
import { format, getQuarter } from 'date-fns'
import { Badge } from '@/shared/components/ui/badge'
import { OtherInspectionTabStatus } from '@/widgets/inspection/ui/inspection-widget'

export const OtherInspectionList: React.FC = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { paramsObject } = useCustomSearchParams()
  const { year = new Date().getFullYear(), quarter = getQuarter(new Date()).toString(), status } = paramsObject

  const {
    data: inspections,
    isLoading,
    totalPages,
  } = usePaginatedData<any>('/inspections/other', {
    ...paramsObject,
    tab: undefined,
    regionId: paramsObject.regionId === 'ALL' ? '' : paramsObject.regionId,
    type: 'OTHER',
    year,
    quarter,
    status: status === OtherInspectionTabStatus.ALL ? undefined : status,
  })

  const handleView = (row: any) => {
    navigate(
      `/inspections/info?inspectionId=${row.id}&tin=${row.legalTin}&name=${row.legalName}&year=${year}&inspectionType=other`
    )
  }

  const statusConfig: Record<
    string,
    { variant: 'warning' | 'info' | 'success' | 'secondary' | 'default'; key: string }
  > = {
    ASSIGNED: { variant: 'warning', key: 'inspections.other.tabs.ASSIGNED' },
    CONDUCTED: { variant: 'info', key: 'inspections.other.tabs.CONDUCTED' },
    CODE_ATTACHED: { variant: 'success', key: 'inspections.other.tabs.CODE_ATTACHED' },
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: t('inspections.other.columns.date'),
      accessorKey: 'startDate',
      filterKey: 'startDate',
      filterType: 'date',
      cell: ({ row }) => {
        const val = row.original.startDate
        if (!val) return '-'
        try {
          return format(new Date(val), 'dd.MM.yyyy')
        } catch {
          return val
        }
      },
    },
    {
      header: t('inspections.other.columns.type'),
      accessorKey: 'noticeType',
      filterKey: 'noticeType',
      filterType: 'select',
      filterOptions: [
        { id: 'NOTIFIED', name: t('inspections.other.types.NOTIFIED') },
        { id: 'AFTER_24_HOURS', name: t('inspections.other.types.AFTER_24_HOURS') },
      ],
      cell: ({ row }) => {
        const type = row.original.noticeType
        return <span>{t(`inspections.other.types.${type}`)}</span>
      },
    },
    {
      header: t('inspections.other.columns.legalName'),
      accessorKey: 'legalName',
    },
    {
      header: t('inspections.other.columns.legalTin'),
      accessorKey: 'legalTin',
      filterKey: 'legalTin',
      filterType: 'search',
    },
    {
      header: t('inspections.other.columns.address'),
      accessorKey: 'objectAddress',
    },
    {
      header: t('inspections.other.columns.number'),
      accessorKey: 'specialCode',
      filterKey: 'specialCode',
      filterType: 'search',
    },
    {
      header: t('inspections.other.columns.status'),
      accessorKey: 'status',
      cell: ({ row }) => {
        const s = row.original.status
        const cfg = statusConfig[s]
        if (!cfg) return <Badge variant="default">{s}</Badge>
        return <Badge variant={cfg.variant}>{t(cfg.key)}</Badge>
      },
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => handleView(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <DataTable
        isPaginated
        showFilters={true}
        data={inspections || []}
        columns={columns as unknown as any}
        isLoading={isLoading}
        pageCount={totalPages}
        className="flex-1"
      />
    </div>
  )
}

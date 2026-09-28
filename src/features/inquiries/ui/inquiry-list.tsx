import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { DataTablePagination } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { InquiryTabs } from './inquiry-tabs'
import {
  appealTypeTranslations,
  InquiryBelongType,
  InquiryStatus,
  inquiryStatusLabels,
  inquiryStatusBadgeVariants,
  inquiryRegistryPath,
} from '../model/types'
import { formatDate } from 'date-fns'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { Eye } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'
import { useRegionSelectQuery } from '@/shared/api/dictionaries'
import { paramOneOf } from '@/shared/lib/url-params'
import { ChangeRegionModal } from './modals/change-region-modal'
import { TruncatedCell } from '@/shared/components/common/truncated-cell'
import type { InquiryRow } from '../model/inquiry.types'

/** How many inquiries a tab holds: one row is asked for, only the total is read */
const useInquiryCount = (belongType: InquiryBelongType | undefined, enabled: boolean) =>
  usePaginatedData<InquiryRow>('/inquiries', { page: 1, size: 1, belongType }, enabled, 60000).totalElements ?? 0

const InquiryTable = () => {
  const { user } = useAuth()
  const {
    paramsObject: { page = 1, size = 10, belongType, ...rest },
    addParams,
  } = useCustomSearchParams()

  const navigate = useNavigate()

  const { data: regions } = useRegionSelectQuery()

  const activeTab = paramOneOf(belongType, [...Object.values(InquiryBelongType), 'ALL' as const], 'ALL')

  const isIndividual = user?.role === UserRoles.INDIVIDUAL

  const { data, isLoading } = usePaginatedData<InquiryRow>('/inquiries', {
    page,
    size,
    belongType: activeTab === 'ALL' ? undefined : activeTab,
    ...rest,
  })

  // Only staff see the tabs, so only they need the counts on them
  const tabCounts: Record<InquiryBelongType | 'ALL', number> = {
    ALL: useInquiryCount(undefined, !isIndividual),
    [InquiryBelongType.HF]: useInquiryCount(InquiryBelongType.HF, !isIndividual),
    [InquiryBelongType.EQUIPMENT]: useInquiryCount(InquiryBelongType.EQUIPMENT, !isIndividual),
    [InquiryBelongType.IRS]: useInquiryCount(InquiryBelongType.IRS, !isIndividual),
    [InquiryBelongType.XRAY]: useInquiryCount(InquiryBelongType.XRAY, !isIndividual),
    [InquiryBelongType.OTHER]: useInquiryCount(InquiryBelongType.OTHER, !isIndividual),
  }

  const handleTabChange = (tab: InquiryBelongType | 'ALL') => {
    addParams({ belongType: tab === 'ALL' ? undefined : tab, page: 1 })
  }

  const columns: ExtendedColumnDef<InquiryRow, unknown>[] = [
    {
      accessorKey: 'registryNumber',
      header: () => <div className="whitespace-nowrap">Murojaat raqami</div>,
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="whitespace-nowrap">Murojaat sanasi</div>,
      cell: ({ row }) =>
        row.original.createdAt ? formatDate(new Date(row.original.createdAt), 'dd.MM.yyyy HH:mm') : '-',
    },
    {
      accessorKey: 'type',
      header: () => <div className="whitespace-nowrap">Murojaat turi</div>,
      cell: ({ row }) => (row.original.type ? appealTypeTranslations[row.original.type] : '-'),
      filterKey: 'type',
      filterType: 'select',
      filterOptions: Object.entries(appealTypeTranslations).map(([id, name]) => ({ id, name })),
    },
    {
      accessorKey: 'regionId',
      header: () => <div className="whitespace-nowrap">Hudud</div>,
      cell: ({ row }) => {
        const region = regions?.find((region) => region.id === row.original.regionId)
        return region?.name || row.original.regionId || '-'
      },
    },
    {
      accessorKey: 'fullName',
      header: () => <div className="whitespace-nowrap">Yuboruvchi F.I.SH.</div>,
      cell: ({ row }) => row.original.fullName || '-',
    },
    {
      accessorKey: 'phoneNumber',
      header: () => <div className="whitespace-nowrap">Telefon raqami</div>,
      cell: ({ row }) => row.original.phoneNumber || '-',
    },
    {
      accessorKey: 'message',
      header: 'Murojaat matni',
      className: 'max-w-[320px]',
      cell: ({ row }) => <TruncatedCell expandable lines={2} value={row.original.message} />,
    },
    {
      accessorKey: 'status',
      header: () => <div className="whitespace-nowrap">Holat</div>,
      cell: ({ row }) => {
        const { status } = row.original
        if (!status) return '-'
        return (
          <Badge variant="outline" className={cn('border-none font-medium', inquiryStatusBadgeVariants[status])}>
            {inquiryStatusLabels[status]}
          </Badge>
        )
      },
      filterKey: 'status',
      filterType: 'select',
      filterOptions: Object.entries(inquiryStatusLabels).map(([id, name]) => ({ id, name })),
    },
    {
      header: 'Amallar',
      accessorKey: 'actions',
      cell: ({ row }) => {
        // OTHER has no registry object behind it, so there is nothing to open
        const registryPath = row.original.belongType ? inquiryRegistryPath[row.original.belongType] : undefined

        // Up to the point real work starts: past IN_PROCESS an inspection or a
        // court case is already under way, and moving the inquiry would strand
        // that work in the region it left.
        const canChangeRegion =
          user?.role === UserRoles.REGIONAL &&
          (row.original.status === InquiryStatus.NEW || row.original.status === InquiryStatus.IN_PROCESS)

        return (
          <div className="flex items-center gap-2">
            {row.original.belongId && registryPath && (
              <Button size="sm" onClick={() => navigate(`/register/${registryPath}/${row.original.belongId}`)}>
                Obyektni ko‘rish
              </Button>
            )}
            {canChangeRegion && (
              <ChangeRegionModal inquiryId={row.original.id} currentRegionId={row.original.regionId} />
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-900"
              onClick={() => navigate(`/inquiries/${row.original.id}`)}
              title="Murojaatni ko‘rish"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredColumns = isIndividual
    ? columns.filter((column) => !('accessorKey' in column) || column.accessorKey !== 'fullName')
    : columns

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {user?.role === UserRoles.INDIVIDUAL && (
        <div className="flex justify-end">
          <Button onClick={() => navigate('/inquiries/add')} className="whitespace-nowrap">
            Murojaat yuborish
          </Button>
        </div>
      )}
      {!isIndividual && <InquiryTabs activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts} />}

      {/* Mobile view for INDIVIDUAL */}
      {isIndividual && (
        <div className="flex flex-1 flex-col gap-2 overflow-hidden md:hidden">
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2">
            {data?.content?.length ? (
              data.content.map((item) => (
                <Link
                  key={item.id}
                  to={`/inquiries/${item.id}`}
                  className="flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">{item.registryNumber || 'Raqamsiz'}</span>
                    {item.status && (
                      <Badge
                        variant="outline"
                        className={cn(
                          'border-none text-[10px] font-medium uppercase',
                          inquiryStatusBadgeVariants[item.status]
                        )}
                      >
                        {inquiryStatusLabels[item.status]}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    {item.createdAt ? formatDate(new Date(item.createdAt), 'dd.MM.yyyy HH:mm') : '-'}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-700">{item.message || '-'}</div>
                </Link>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center p-4 text-sm text-slate-500">
                Ma’lumot topilmadi
              </div>
            )}
          </div>
          <div className="rounded-lg border-t bg-white p-2">
            <DataTablePagination
              data={data}
              onPageChange={(p) => addParams({ page: p })}
              onPageSizeChange={(s) => addParams({ size: s, page: 1 })}
              showSizeChanger={false}
              showTotal={false}
            />
          </div>
        </div>
      )}

      {/* Desktop or Default View */}
      <div className={cn('flex flex-1 flex-col overflow-hidden', isIndividual && 'hidden md:flex')}>
        <DataTable
          showNumeration={true}
          isPaginated={true}
          columns={filteredColumns}
          data={data ?? []}
          showFilters={true}
          isLoading={isLoading}
          className="flex-1"
        />
      </div>
    </div>
  )
}

export default InquiryTable

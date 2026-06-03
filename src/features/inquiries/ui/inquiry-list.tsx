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
} from '../model/types'
import { formatDate } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button.tsx'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { Eye } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'

const InquiryTable = () => {
  const { user } = useAuth()
  const {
    paramsObject: { page = 1, size = 10, belongType, ...rest },
    addParams,
  } = useCustomSearchParams()

  const navigate = useNavigate()

  const activeTab = (belongType as InquiryBelongType | 'ALL') || 'ALL'

  const isIndividual = user?.role === UserRoles.INDIVIDUAL

  const { data, isLoading } = usePaginatedData<any>('/inquiries', {
    page,
    size,
    belongType: activeTab === 'ALL' ? undefined : activeTab,
    ...rest,
  })

  const { data: hfData } = usePaginatedData<any>(
    '/inquiries',
    {
      page: 1,
      size: 1,
      belongType: InquiryBelongType.HF,
    },
    true,
    60000
  )

  const { data: equipmentsData } = usePaginatedData<any>(
    '/inquiries',
    {
      page: 1,
      size: 1,
      belongType: InquiryBelongType.EQUIPMENT,
    },
    true,
    60000
  )

  const { data: irsData } = usePaginatedData<any>(
    '/inquiries',
    {
      page: 1,
      size: 1,
      belongType: InquiryBelongType.IRS,
    },
    true,
    60000
  )

  const { data: xrayData } = usePaginatedData<any>(
    '/inquiries',
    {
      page: 1,
      size: 1,
      belongType: InquiryBelongType.XRAY,
    },
    true,
    60000
  )

  const tabCounts = {
    ALL:
      (hfData?.page?.totalElements ?? 0) +
      (equipmentsData?.page?.totalElements ?? 0) +
      (irsData?.page?.totalElements ?? 0) +
      (xrayData?.page?.totalElements ?? 0),
    [InquiryBelongType.HF]: hfData?.page?.totalElements ?? 0,
    [InquiryBelongType.EQUIPMENT]: equipmentsData?.page?.totalElements ?? 0,
    [InquiryBelongType.IRS]: irsData?.page?.totalElements ?? 0,
    [InquiryBelongType.XRAY]: xrayData?.page?.totalElements ?? 0,
  }

  const handleTabChange = (tab: InquiryBelongType | 'ALL') => {
    addParams({ belongType: tab === 'ALL' ? undefined : tab, page: 1 })
  }

  const columns: ExtendedColumnDef<any, any>[] = [
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
      cell: ({ row }) => appealTypeTranslations[row.original.type] || row.original.type,
      filterKey: 'type',
      filterType: 'select',
      filterOptions: [
        { name: 'Murojaat', id: 'APPEAL' },
        { name: 'Huquqbuzarliik xabari', id: 'RISK_APPEAL' },
        { name: 'Taklif', id: 'SUGGESTION' },
      ],
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
      cell: ({ row }) => <span title={row.original.message}>{row.original.message}</span>,
    },
    {
      accessorKey: 'status',
      header: () => <div className="whitespace-nowrap">Holat</div>,
      cell: ({ row }) => {
        const status = row.original.status as InquiryStatus
        const label = inquiryStatusLabels[status] || status || '-'
        const variantClass = inquiryStatusBadgeVariants[status] || 'bg-gray-100 text-gray-800'
        return (
          <Badge variant="outline" className={cn('border-none font-medium', variantClass)}>
            {label}
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
        const belongTypeStr =
          row.original.belongType === 'HF'
            ? 'hf'
            : row.original.belongType === 'EQUIPMENT'
              ? 'equipments'
              : row.original.belongType === 'IRS'
                ? 'irs'
                : 'xrays'

        return (
          <div className="flex gap-2">
            {row.original.belongId && (
              <Button size="sm" onClick={() => navigate(`/register/${row.original.belongId}/${belongTypeStr}`)}>
                Obyektni ko‘rish
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-slate-900"
              onClick={() => navigate(`/inquiries/detail/${row.original.id}`)}
              title="Murojaatni ko'rish"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const filteredColumns =
    user?.role === UserRoles.INDIVIDUAL ? columns.filter((c: any) => c.accessorKey !== 'fullName') : columns

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      {user?.role === UserRoles.INDIVIDUAL && (
        <div className="flex justify-end">
          <Button onClick={() => navigate('/inquiries/add')} className="whitespace-nowrap">
            Murojaat yuborish
          </Button>
        </div>
      )}
      {!isIndividual && <InquiryTabs activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts as any} />}

      {/* Mobile view for INDIVIDUAL */}
      {isIndividual && (
        <div className="flex flex-1 flex-col gap-2 overflow-hidden md:hidden">
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto pb-2">
            {data?.content?.length ? (
              data.content.map((item: any) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/inquiries/detail/${item.id}`)}
                  className="flex cursor-pointer flex-col gap-2 rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-600">{item.registryNumber || 'Raqamsiz'}</span>
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-none text-[10px] font-medium uppercase',
                        inquiryStatusBadgeVariants[item.status as InquiryStatus] || 'bg-gray-100 text-gray-800'
                      )}
                    >
                      {inquiryStatusLabels[item.status as InquiryStatus] || item.status || '-'}
                    </Badge>
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    {item.createdAt ? formatDate(new Date(item.createdAt), 'dd.MM.yyyy HH:mm') : '-'}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-700">{item.message || '-'}</div>
                </div>
              ))
            ) : (
              <div className="flex flex-1 items-center justify-center p-4 text-sm text-slate-500">
                Maʼlumot topilmadi
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
      <div className={cn('flex-1 overflow-hidden', isIndividual && 'hidden md:flex md:flex-col')}>
        <DataTable
          showNumeration={true}
          isPaginated={true}
          columns={filteredColumns}
          data={data as any}
          showFilters={true}
          isLoading={isLoading}
          className="flex-1"
        />
      </div>
    </div>
  )
}

export default InquiryTable

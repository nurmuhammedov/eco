import { DataTable } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { InquiryTabs } from './inquiry-tabs'
import { appealTypeTranslations, InquiryBelongType } from '../model/types'
import { formatDate } from 'date-fns'
import FileLink from '@/shared/components/common/file-link'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/shared/components/ui/button.tsx'

const InquiryTable = () => {
  const {
    paramsObject: { page = 1, size = 10, belongType, ...rest },
    addParams,
  } = useCustomSearchParams()

  const navigate = useNavigate()

  const activeTab = (belongType as InquiryBelongType) || InquiryBelongType.HF

  const { data = [], isLoading } = usePaginatedData<any>('/inquiries', {
    page,
    size,
    belongType: activeTab,
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
    [InquiryBelongType.HF]: hfData?.page?.totalElements ?? 0,
    [InquiryBelongType.EQUIPMENT]: equipmentsData?.page?.totalElements ?? 0,
    [InquiryBelongType.IRS]: irsData?.page?.totalElements ?? 0,
    [InquiryBelongType.XRAY]: xrayData?.page?.totalElements ?? 0,
  }

  const handleTabChange = (tab: InquiryBelongType) => {
    addParams({ belongType: tab, page: 1 })
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'registryNumber',
      header: () => <div className="whitespace-nowrap">Murojaat raqami</div>,
      className: '!w-[1%]',
      filterKey: 'registryNumber',
      filterType: 'search',
    },
    {
      accessorKey: 'createdAt',
      header: () => <div className="whitespace-nowrap">Murojaat sanasi</div>,
      className: '!w-[1%] whitespace-nowrap',
      cell: ({ row }) =>
        row.original.createdAt ? formatDate(new Date(row.original.createdAt), 'dd.MM.yyyy HH:mm') : '-',
    },
    {
      accessorKey: 'type',
      header: () => <div className="whitespace-nowrap">Murojaat turi</div>,
      className: '!w-[1%] whitespace-nowrap',
      cell: ({ row }) => appealTypeTranslations[row.original.type] || row.original.type,
      filterKey: 'type',
      filterType: 'select',
      filterOptions: [
        { name: 'Murojaat', id: 'APPEAL' },
        { name: 'Shikoyat', id: 'COMPLAINT' },
        { name: 'Taklif', id: 'SUGGESTION' },
      ],
    },
    {
      accessorKey: 'fullName',
      header: () => <div className="whitespace-nowrap">Yuboruvchi F.I.SH.</div>,
      className: '!w-[1%] whitespace-nowrap',
      cell: ({ row }) => row.original.fullName || '-',
    },
    {
      accessorKey: 'phoneNumber',
      header: () => <div className="whitespace-nowrap">Telefon raqami</div>,
      className: '!w-[1%] whitespace-nowrap',
      cell: ({ row }) => row.original.phoneNumber || '-',
    },
    {
      accessorKey: 'message',
      header: 'Murojaat matni',
      cell: ({ row }) => <span title={row.original.message}>{row.original.message}</span>,
    },
    {
      header: 'Biriktirilgan fayl',
      accessorKey: 'filePath',
      className: '!w-[1%]',
      cell: ({ row }) => (row.original.filePath ? <FileLink url={row.original.filePath} /> : '-'),
    },
    {
      header: 'Obyekt',
      accessorKey: 'belongId',
      className: '!w-[1%]',
      cell: ({ row }) => (
        <Button
          onClick={() =>
            navigate(
              `/register/${row.original.belongId}/${activeTab == InquiryBelongType.HF ? 'hf' : activeTab == InquiryBelongType.EQUIPMENT ? 'equipments' : activeTab == InquiryBelongType.IRS ? 'irs' : 'xrays'}`
            )
          }
        >
          Obyektni ko‘rish
        </Button>
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-2 overflow-hidden">
      <InquiryTabs activeTab={activeTab} onTabChange={handleTabChange} counts={tabCounts} />
      <DataTable
        showNumeration={true}
        isPaginated={true}
        columns={columns}
        data={data}
        showFilters={true}
        isLoading={isLoading}
        className="flex-1"
      />
    </div>
  )
}

export default InquiryTable

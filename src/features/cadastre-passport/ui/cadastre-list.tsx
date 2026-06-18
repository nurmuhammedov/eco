import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { Badge } from '@/shared/components/ui/badge'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import useDelete from '@/shared/hooks/api/useDelete'

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    NEW: { label: 'Yangi', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent' },
    IN_APPROVAL: {
      label: 'Kelishishda',
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-transparent',
    },
    IN_REVIEW: {
      label: 'Kelishishda',
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-transparent',
    },
    IN_COMMITTEE: {
      label: 'Qo‘mitada',
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent',
    },
    COMMITTEE: { label: 'Qo‘mita', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent' },
    COMPLETED: { label: 'Yakunlangan', className: 'bg-green-100 text-green-800 hover:bg-green-200 border-transparent' },
    APPROVED: { label: 'Tasdiqlangan', className: 'bg-green-100 text-green-800 hover:bg-green-200 border-transparent' },
    REJECTED: { label: 'Rad etildi', className: 'bg-red-100 text-red-800 hover:bg-red-200 border-transparent' },
  }
  const match = map[status] || { label: status, className: 'bg-gray-100 text-gray-800 border-transparent' }
  return (
    <Badge variant="outline" className={match.className}>
      {match.label}
    </Badge>
  )
}

export default function CadastreList() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const {
    paramsObject: { page = 1, size = 10, ...rest },
  } = useCustomSearchParams()

  const { data, isLoading, refetch, totalPages, totalElements } = usePaginatedData<any>('/cadastre-passports', {
    page,
    size,
    ...rest,
  })

  const { mutate: deleteCadastre } = useDelete('/cadastre-passports')

  const isLegal = user?.role === UserRoles.LEGAL
  const userTinOrPin = String(user?.tinOrPin || '')
  const isFVV = userTinOrPin === '201862006' && user?.role === UserRoles.LEGAL
  const isSES = userTinOrPin === '200794614' && user?.role === UserRoles.LEGAL

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'requestNumber',
      header: 'Ariza raqami',
      filterKey: 'requestNumber',
      filterType: 'search',
      cell: ({ row }) => row.original.requestNumber || '-',
    },
    {
      accessorKey: 'registryNumber',
      header: 'Reyestr raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
      cell: ({ row }) => row.original.registryNumber || '-',
    },
    {
      accessorKey: 'preparerName',
      header: 'Ishlab chiqqan tashkilot',
      filterKey: 'preparerName',
      filterType: 'search',
      cell: ({ row }) => row.original.preparerName || '-',
    },
    {
      accessorKey: 'preparerTin',
      header: 'Ishlab chiqqan tashkilot STIR',
      filterKey: 'preparerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'customerName',
      header: 'Tashkilot nomi',
      filterKey: 'customerName',
      filterType: 'search',
      cell: ({ row }) => row.original.customerName || '-',
    },
    {
      accessorKey: 'customerTin',
      header: 'Tashkilot STIR',
      filterKey: 'customerTin',
      filterType: 'search',
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      filterKey: 'status',
      filterType: 'select',
      filterOptions: [
        { id: 'NEW', name: 'Yangi' },
        { id: 'IN_REVIEW', name: 'Kelishishda' },
        { id: 'IN_COMMITTEE', name: 'Qo‘mitada' },
        { id: 'APPROVED', name: 'Tasdiqlangan' },
        { id: 'REJECTED', name: 'Rad etildi' },
      ],
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableRowActions
            row={row}
            showView
            onView={(r) => navigate(`/cadastre-passport/${r.original.id}`)}
            showDelete={row.original.status === 'NEW' && isLegal}
            onDelete={(r) => {
              deleteCadastre(r.original.id, {
                onSuccess: () => refetch(),
              })
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {isLegal && !isFVV && !isSES && (
          <Button onClick={() => navigate('/cadastre-passport/add')}>
            <Plus className="mr-2 h-4 w-4" />
            TXYZ kadastr qo'shish
          </Button>
        )}
      </div>
      <DataTable
        showFilters
        isPaginated
        data={data?.content || []}
        columns={columns as unknown as any}
        isLoading={isLoading}
        pageCount={totalPages}
        total={totalElements}
        className="flex-1"
      />
    </div>
  )
}

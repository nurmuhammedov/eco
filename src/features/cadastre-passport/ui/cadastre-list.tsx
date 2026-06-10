import { useCadastreMock } from '../model/use-cadastre-mock'
import { Button } from '@/shared/components/ui/button'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { Badge } from '@/shared/components/ui/badge'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'

export const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    NEW: { label: 'Yangi', className: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-transparent' },
    IN_APPROVAL: {
      label: 'Kelishishda',
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-transparent',
    },
    COMMITTEE: { label: 'Qo‘mita', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent' },
    COMPLETED: { label: 'Yakunlangan', className: 'bg-green-100 text-green-800 hover:bg-green-200 border-transparent' },
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
  const { data, deleteItem } = useCadastreMock()

  const isLegal = user?.role === UserRoles.LEGAL
  const userTinOrPin = String(user?.tinOrPin || '')
  const isFVV = userTinOrPin === '303058580' && user?.role === UserRoles.LEGAL
  const isSES = userTinOrPin === '302358106' && user?.role === UserRoles.LEGAL
  const isCommittee = user?.role === UserRoles.MANAGER

  const filteredData = data.filter((item) => {
    if (isCommittee) {
      return ['COMMITTEE', 'COMPLETED', 'REJECTED'].includes(item.status)
    }
    if (isFVV || isSES) {
      return item.status !== 'NEW'
    }
    return true
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'registryNumber',
      header: 'Reyestr raqami',
      filterKey: 'registryNumber',
      filterType: 'search',
      cell: ({ row }) => row.original.registryNumber || '-',
    },
    {
      accessorKey: 'creatorOrgName',
      header: 'Ishlab chiqqan tashkilot',
      filterKey: 'creatorOrgName',
      filterType: 'search',
    },
    {
      accessorKey: 'creatorOrgStir',
      header: 'Ishlab chiqqan tashkilot STIR',
      filterKey: 'creatorOrgStir',
      filterType: 'search',
    },
    {
      accessorKey: 'targetOrgName',
      header: 'Tashkilot nomi',
      filterKey: 'targetOrgName',
      filterType: 'search',
    },
    {
      accessorKey: 'targetOrgStir',
      header: 'Tashkilot STIR',
      filterKey: 'targetOrgStir',
      filterType: 'search',
    },
    {
      accessorKey: 'status',
      header: 'Holati',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
            onDelete={(r) => deleteItem(r.original.id)}
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
        data={filteredData || []}
        columns={columns as unknown as any}
        className="flex-1"
      />
    </div>
  )
}

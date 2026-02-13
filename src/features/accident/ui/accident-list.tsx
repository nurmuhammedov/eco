import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Eye, Plus, Pencil } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { AccidentListItem } from '../model/types'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table.tsx'
import { useCurrentRole } from '@/shared/hooks/use-current-role'
import { UserRoles } from '@/entities/user'

export const AccidentList: React.FC = () => {
  const navigate = useNavigate()
  const { data: accidents, isLoading, totalPages } = usePaginatedData<AccidentListItem>('/accidents')
  const role = useCurrentRole()

  const handleView = (row: AccidentListItem) => {
    if (row.id) {
      navigate(`/accidents/${row.id}`)
    }
  }

  const getStatusBadge = (status?: string | null) => {
    if (!status) return '-'

    let variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'info' | 'warning' | 'success' = 'outline'
    let label = status

    switch (status) {
      case 'NEW':
        variant = 'info'
        label = 'Yangi'
        break
      case 'IN_PROCESS':
        variant = 'warning'
        label = 'Jarayonda'
        break
      case 'COMPLETED':
        variant = 'success'
        label = 'Yakunlangan'
        break
    }

    return <Badge variant={variant}>{label}</Badge>
  }

  const columns: ExtendedColumnDef<AccidentListItem, any>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
    },
    {
      header: 'Tashkilot STIR',
      accessorKey: 'legalTin',
    },
    {
      header: 'XICHO',
      accessorKey: 'hfName',
    },
    {
      header: 'Yengil',
      accessorKey: 'minorInjuryCount',
    },
    {
      header: 'Og‘ir',
      accessorKey: 'seriousInjuryCount',
    },
    {
      header: 'O‘lim',
      accessorKey: 'fatalInjuryCount',
    },
    {
      header: 'Guruhli',
      accessorKey: 'multiple',
      cell: ({ row }) => (row.original.multiple ? 'Ha' : 'Yo‘q'),
    },
    {
      header: 'Holati',
      accessorKey: 'status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          {role === UserRoles.INSPECTOR && row.original?.status !== 'COMPLETED' && (
            <Button variant="ghost" size="icon" onClick={() => navigate(`/accidents/${row.original.id}/edit`)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex justify-end">
        {role === UserRoles.INSPECTOR && (
          <Button onClick={() => navigate('/accidents/add')}>
            <Plus className="mr-2 h-4 w-4" /> Qo‘shish
          </Button>
        )}
      </div>
      <DataTable
        data={accidents || []}
        columns={columns}
        isLoading={isLoading}
        pageCount={totalPages}
        isPaginated
        className="flex-1"
      />
    </div>
  )
}

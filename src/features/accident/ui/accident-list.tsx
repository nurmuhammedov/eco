import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { Eye, Plus } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import usePaginatedData from '@/shared/hooks/api/usePaginatedData'
import { AccidentListItem } from '../model/types'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table.tsx'

export const AccidentList: React.FC = () => {
  const navigate = useNavigate()
  const { data: accidents, isLoading, totalPages } = usePaginatedData<AccidentListItem>('/accidents')

  const handleView = (row: AccidentListItem) => {
    if (row.id) {
      navigate(`/accidents/${row.id}`)
    }
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
      header: 'Yengil jabrlanuvchilar soni',
      accessorKey: 'minorInjuryCount',
    },
    {
      header: 'Og‘ir jabrlanuvchilar soni',
      accessorKey: 'seriousInjuryCount',
    },
    {
      header: 'O‘lim soni',
      accessorKey: 'fatalInjuryCount',
    },
    {
      header: 'Guruhli',
      accessorKey: 'multiple',
      cell: ({ row }) => (row.original.multiple ? 'Ha' : 'Yo‘q'),
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
      <div className="mb-4 flex justify-end">
        <Button onClick={() => navigate('/accidents/add')}>
          <Plus className="mr-2 h-4 w-4" /> Qo'shish
        </Button>
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

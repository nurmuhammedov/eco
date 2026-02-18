import { DataTable } from '@/shared/components/common/data-table'
import { format } from 'date-fns'
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
import { TabsLayout } from '@/shared/layouts'
import { useCustomSearchParams } from '@/shared/hooks'

export const getStatusBadge = (status?: string | null) => {
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

const AccidentList: React.FC = () => {
  const navigate = useNavigate()
  const {
    addParams,
    paramsObject: { type = 'INJURY' },
  } = useCustomSearchParams()
  const {
    data: accidents,
    isLoading,
    totalPages,
  } = usePaginatedData<AccidentListItem>('/accidents', {
    type,
  })
  const role = useCurrentRole()

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
    // {
    //   header: 'Turi',
    //   accessorKey: 'type',
    //   cell: ({ row }) => getTypeBadge(row.original.type),
    // },
    {
      header: type === 'INJURY' ? 'Sana' : 'Sana va vaqt',
      accessorKey: type === 'INJURY' ? 'date' : 'dateTime',
      cell: ({ row }) => {
        const val = type === 'INJURY' ? (row.original as any).date : row.original.dateTime
        if (!val) return '-'
        return type === 'INJURY' ? format(new Date(val), 'dd.MM.yyyy') : format(new Date(val), 'dd.MM.yyyy, HH:mm')
      },
    },
    ...(type === 'INJURY'
      ? [
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
            cell: ({ row }: any) => (row.original.multiple ? 'Ha' : 'Yo‘q'),
          },
        ]
      : []),
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const editPath =
                  row.original.type === 'INJURY'
                    ? `/accidents/injury/${row.original.id}/edit`
                    : `/accidents/non-injury/${row.original.id}/edit`
                navigate(editPath)
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-0 flex justify-between gap-2">
        <TabsLayout
          activeTab={type?.toString()}
          className="mb-2"
          tabs={[
            {
              id: 'INJURY',
              name: 'Baxtsiz hodisalar',
            },
            {
              id: 'NON_INJURY',
              name: 'Avariyalar',
            },
          ]}
          onTabChange={(type) => addParams({ type: type }, 'page')}
        />
        {role === UserRoles.INSPECTOR && (
          <>
            {type == 'INJURY' ? (
              <Button onClick={() => navigate('/accidents/injury/add')} variant="default">
                <Plus className="mr-2 h-4 w-4" /> Baxtsiz hodisa qo‘shish
              </Button>
            ) : type == 'NON_INJURY' ? (
              <Button onClick={() => navigate('/accidents/non-injury/add')} variant="default">
                <Plus className="mr-2 h-4 w-4" /> Avariya qo‘shish
              </Button>
            ) : null}
          </>
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
export default AccidentList

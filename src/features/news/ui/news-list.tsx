import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { usePaginatedData, useDelete } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/entities/user'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { getDate } from '@/shared/utils/date'

export const NewsList: FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === UserRoles.ADMIN

  const endpoint = isAdmin ? '/announcements/admin' : '/announcements'

  const { data, isLoading, refetch } = usePaginatedData<any>(endpoint, {
    size: 10,
    page: 1,
  })

  const { mutate: deleteNews } = useDelete('/announcements/', null, 'Muvaffaqiyatli oʻchirildi')

  const handleDelete = (id: number) => {
    deleteNews(id, {
      onSuccess: () => refetch(),
    })
  }

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      header: 'Sana',
      accessorFn: (row) => getDate(row.createdAt),
    },
    {
      header: 'Sarlavha',
      accessorKey: 'title',
    },
    ...(isAdmin
      ? [
          {
            header: 'Holati',
            accessorKey: 'isActive',
            cell: ({ row }: any) => (
              <Badge variant={row.original.isActive ? 'success' : 'error'}>
                {row.original.isActive ? 'Aktiv' : 'Nofaol'}
              </Badge>
            ),
          },
        ]
      : []),
    {
      id: 'actions',
      className: '!w-[1%]',
      cell: ({ row }: any) => (
        <DataTableRowActions
          row={row}
          showView
          onView={() => navigate(`/news/${row.original.id}`)}
          showEdit={isAdmin}
          onEdit={() => navigate(`/news/edit/${row.original.id}`)}
          showDelete={isAdmin}
          onDelete={() => handleDelete(row.original.id)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-end">
        {isAdmin && (
          <Button onClick={() => navigate('/news/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Xabarnoma qoʻshish
          </Button>
        )}
      </div>

      <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} className="flex-1" />
    </div>
  )
}

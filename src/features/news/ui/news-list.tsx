import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useCustomSearchParams, usePaginatedData, useDelete } from '@/shared/hooks'
import { useAuth } from '@/shared/hooks/use-auth'
import { UserRoles } from '@/shared/types/user'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { getDate } from '@/shared/utils/date'
import type { Row } from '@tanstack/react-table'
import type { Announcement } from '../model/types'

export const NewsList: FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === UserRoles.ADMIN

  const endpoint = isAdmin ? '/announcements/admin' : '/announcements'

  const {
    paramsObject: { page = 1, size = 10 },
  } = useCustomSearchParams()

  const { data, isLoading } = usePaginatedData<Announcement>(endpoint, { page, size })

  // The delete refreshes every announcement list, the admin one included
  const { mutate: deleteNews } = useDelete('/announcements', null, 'Muvaffaqiyatli o‘chirildi')

  const columns: ExtendedColumnDef<Announcement, unknown>[] = [
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
            cell: ({ row }: { row: Row<Announcement> }) => (
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
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          showView
          onView={() => navigate(`/news/${row.original.id}`)}
          showEdit={isAdmin}
          onEdit={() => navigate(`/news/${row.original.id}/edit`)}
          showDelete={isAdmin}
          onDelete={() => deleteNews(row.original.id)}
        />
      ),
    },
  ]

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-end">
        {isAdmin && (
          <Button onClick={() => navigate('/news/add')}>
            <Plus className="mr-2 h-4 w-4" />
            Xabarnoma qo‘shish
          </Button>
        )}
      </div>

      <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} className="flex-1" />
    </div>
  )
}

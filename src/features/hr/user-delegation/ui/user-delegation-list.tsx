import { useState } from 'react'
import { ExtendedColumnDef } from '@/shared/components/common/data-table/data-table'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { DataTable } from '@/shared/components/common/data-table'
import { Button } from '@/shared/components/ui/button'
import { TabsLayout } from '@/shared/layouts'
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks'
import { AddDelegationModal, DelegationReasonLabels } from './add-delegation-modal'
import { Badge } from '@/shared/components/ui/badge'
import { UserRoles, UserRoleLabels } from '@/entities/user'
import FileLink from '@/shared/components/common/file-link'
import DeleteConfirmationDialog from '@/shared/components/common/delete-confirm-dialog'
import { Ban } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useUpdate } from '@/shared/hooks'

const DeactivateButton = ({ row }: { row: any }) => {
  const queryClient = useQueryClient()
  const { mutate: deactivate, isPending } = useUpdate<any, any, any>(
    '/user-delegation',
    `${row.id}/deactivate`,
    'put',
    'Muvaffaqiyatli bekor qilindi'
  )

  return (
    <DeleteConfirmationDialog
      title="Bekor qilish"
      description={`${row.delegatorFullName} tomonidan ${row.delegateeFullName} ga vazifa yuklatilishini haqiqatdan bekor qilmochimisiz?`}
      confirmText="Tasdiqlash"
      onConfirm={() => {
        deactivate(
          {},
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['/user-delegation'] })
            },
          }
        )
      }}
      trigger={
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:bg-red-50 hover:text-red-700"
          disabled={isPending}
          title="Bekor qilish"
        >
          <Ban className="h-4 w-4" />
        </Button>
      }
    />
  )
}

export function UserDelegationList() {
  const {
    paramsObject: { page = 1, size = 10, isActive: rawIsActive, ...rest },
    addParams,
    removeParams,
  } = useCustomSearchParams()

  // rawIsActive comes as boolean from URL parser
  const isActiveStr = rawIsActive === true ? 'true' : rawIsActive === false ? 'false' : undefined

  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading } = usePaginatedData<any>('/user-delegation', {
    page,
    size,
    ...(isActiveStr !== undefined ? { isActive: rawIsActive } : {}),
    ...rest,
  })

  const columns: ExtendedColumnDef<any, any>[] = [
    {
      accessorKey: 'delegatorFullName',
      header: 'Kim tomonidan',
      filterKey: 'delegatorFullName',
      filterType: 'search',
      cell: ({ row }) => {
        const name = row.original.delegatorFullName
        const role = row.original.delegatorRole
        const roleLabel = role && UserRoleLabels[role as UserRoles] ? ` (${UserRoleLabels[role as UserRoles]})` : ''
        return `${name || '-'}${roleLabel}`
      },
    },
    {
      accessorKey: 'delegateeFullName',
      header: 'Kimga',
      filterKey: 'delegateeFullName',
      filterType: 'search',
      cell: ({ row }) => {
        const name = row.original.delegateeFullName
        const role = row.original.delegateeRole
        const roleLabel = role && UserRoleLabels[role as UserRoles] ? ` (${UserRoleLabels[role as UserRoles]})` : ''
        return `${name || '-'}${roleLabel}`
      },
    },
    {
      accessorKey: 'startDate',
      header: 'Boshlanish sanasi',
      cell: ({ row }) => {
        const val = row.original.startDate
        return val ? format(new Date(val), 'dd.MM.yyyy') : '-'
      },
    },
    {
      accessorKey: 'endDate',
      header: 'Tugash sanasi',
      cell: ({ row }) => {
        const val = row.original.endDate
        return val ? format(new Date(val), 'dd.MM.yyyy') : '-'
      },
    },
    {
      accessorKey: 'reasonType',
      header: 'Sabab turi',
      cell: ({ row }) => {
        const val = row.original.reasonType
        return val && DelegationReasonLabels[val] ? DelegationReasonLabels[val] : val || '-'
      },
    },
    {
      accessorKey: 'basisPath',
      header: 'Asos fayli',
      cell: ({ row }) => {
        const path = row.original.basisPath
        return path ? <FileLink url={path} /> : '-'
      },
    },
    {
      accessorKey: 'active',
      header: 'Holati',
      cell: ({ row }) => {
        const isActive = row.original.active
        return (
          <Badge variant={isActive ? 'default' : 'destructive'} className={isActive ? 'bg-green-500' : ''}>
            {isActive ? 'Faol' : "Muddati o'tgan"}
          </Badge>
        )
      },
    },
    {
      id: 'actions',
      header: 'Harakat',
      cell: ({ row }) => {
        const isActive = row.original.active
        if (!isActive) return '-'
        return <DeactivateButton row={row.original} />
      },
    },
  ]

  const onTabChange = (value: string) => {
    if (value === 'ALL') {
      removeParams('isActive')
    } else {
      addParams({ isActive: value === 'true' }, 'page')
    }
  }

  const currentTab = isActiveStr ?? 'ALL'

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <TabsLayout
        activeTab={currentTab}
        onTabChange={onTabChange}
        tabs={[
          { id: 'ALL', name: 'Barchasi' },
          { id: 'true', name: 'Aktiv' },
          { id: 'false', name: "Muddati o'tganlar (Bekor qilinganlar)" },
        ]}
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Qo'shish
          </Button>
        }
      />

      <DataTable showFilters isLoading={isLoading} isPaginated columns={columns} data={data || []} className="flex-1" />

      <AddDelegationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

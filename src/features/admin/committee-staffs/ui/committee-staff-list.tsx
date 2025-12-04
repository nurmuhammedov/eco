import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { UIModeEnum } from '@/shared/types/ui-types'
import { useFilters } from '@/shared/hooks/use-filters'
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { formatPhoneNumber, getUserRoleDisplay, getUserStatusDisplay } from '@/shared/lib'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import {
  CommitteeStaffTableItem,
  FilterCommitteeStaffDTO,
  useCommitteeStaffListQuery,
  useDeleteCommitteeStaff,
} from '@/entities/admin/committee-staffs'

export function CommitteeStaffList() {
  const { filters } = useFilters()
  const { t } = useTranslation('common')
  const { onOpen } = useCommitteeStaffsDrawer()
  const { data, isLoading } = useCommitteeStaffListQuery(filters as FilterCommitteeStaffDTO)
  const deleteData = useDeleteCommitteeStaff()

  const onDelete = (id: string) => deleteData.mutate(id)

  const onEdit = (id: string) => onOpen(UIModeEnum.EDIT, { id })

  const onView = (id: string) => onOpen(UIModeEnum.VIEW, { id })

  const columns: ColumnDef<CommitteeStaffTableItem>[] = [
    {
      accessorKey: 'fullName',
      minSize: 250,
      header: t('short.full_name'),
    },
    {
      minSize: 170,
      accessorKey: 'pin',
      header: t('short.pin'),
    },
    {
      accessorKey: 'department',
      minSize: 300,
      header: t('committee_division_department'),
    },
    {
      minSize: 200,
      accessorKey: 'position',
      header: t('position'),
    },
    {
      minSize: 150,
      accessorKey: 'role',
      header: t('role'),
      cell: ({ row }) => getUserRoleDisplay(row.original.role, t),
    },
    {
      minSize: 100,
      accessorKey: 'enabled',
      header: t('status'),
      cell: ({ row }) => getUserStatusDisplay(row.original.enabled, t),
    },
    {
      minSize: 180,
      accessorKey: 'phoneNumber',
      header: t('phone'),
      cell: ({ row }) => formatPhoneNumber(row.original.phoneNumber),
    },
    {
      id: 'actions',
      maxSize: 200,
      minSize: 100,
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          showView
          row={row}
          showDelete
          onView={(row) => onView(row.original.id)}
          onEdit={(row) => onEdit(row.original.id)}
          onDelete={(row) => onDelete(row.original.id)}
        />
      ),
    },
  ]

  return (
    <DataTable
      isPaginated
      data={data || []}
      columns={columns}
      isLoading={isLoading}
      className="h-[calc(100svh-270px)]"
    />
  )
}

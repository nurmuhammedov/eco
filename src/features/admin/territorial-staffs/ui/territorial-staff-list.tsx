import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { UIModeEnum } from '@/shared/types/ui-types'
import { useFilters } from '@/shared/hooks/use-filters'
import { useTerritorialStaffsDrawer } from '@/shared/hooks/entity-hooks'
import { formatPhoneNumber, getUserRoleDisplay, getUserStatusDisplay } from '@/shared/lib'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import {
  FilterTerritorialStaffDTO,
  TerritorialStaffTableItem,
  useDeleteTerritorialStaff,
  useTerritorialStaffListQuery,
} from '@/entities/admin/territorial-staffs'

export function TerritorialStaffList() {
  const { filters } = useFilters()
  const { t } = useTranslation('common')
  const { onOpen } = useTerritorialStaffsDrawer()
  const { data, isLoading } = useTerritorialStaffListQuery(filters as FilterTerritorialStaffDTO)
  const deleteData = useDeleteTerritorialStaff()

  const onDelete = (id: string) => deleteData.mutate(id)

  const onEdit = (id: string) => onOpen(UIModeEnum.EDIT, { id })

  const onView = (id: string) => onOpen(UIModeEnum.VIEW, { id })

  const columns: ColumnDef<TerritorialStaffTableItem>[] = [
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
      accessorKey: 'office',
      minSize: 300,
      header: t('territorial_department_name'),
    },
    {
      minSize: 230,
      accessorKey: 'position',
      header: t('position'),
    },
    {
      minSize: 200,
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

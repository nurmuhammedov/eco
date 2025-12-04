import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { UIModeEnum } from '@/shared/types/ui-types'
import { useFilters } from '@/shared/hooks/use-filters'
import { useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import {
  FilterTerritorialDepartmentsDTO,
  TerritorialDepartment,
  useDeleteTerritorialDepartments,
  useTerritorialDepartmentsQuery,
} from '@/entities/admin/territorial-departments'

export function TerritorialDepartmentsList() {
  const { filters } = useFilters()
  const { t } = useTranslation('common')
  const { onOpen } = useTerritorialDepartmentsDrawer()
  const { data, isLoading } = useTerritorialDepartmentsQuery(filters as FilterTerritorialDepartmentsDTO)

  const deleteData = useDeleteTerritorialDepartments()

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id })

  const onDelete = (id: number) => deleteData.mutate(id)

  const columns: ColumnDef<TerritorialDepartment>[] = [
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      maxSize: -10,
      header: t('name'),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          row={row}
          showDelete
          onEdit={(row) => onEdit(row.original.id!)}
          onDelete={(row) => onDelete(row.original.id!)}
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

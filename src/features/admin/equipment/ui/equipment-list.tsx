import { ColumnDef } from '@tanstack/react-table'
import { UIModeEnum } from '@/shared/types/ui-types'
import { useEquipmentTypeLabel } from '@/shared/hooks'
import { useFilters } from '@/shared/hooks/use-filters'
import { useEquipmentDrawer } from '@/shared/hooks/entity-hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { Equipment, FilterEquipmentDTO, useDeleteEquipment, useEquipmentList } from '@/entities/admin/equipment'

export function EquipmentList() {
  const { filters } = useFilters()
  const { onOpen } = useEquipmentDrawer()

  const getEquipmentTypeLabel = useEquipmentTypeLabel()

  const deleteData = useDeleteEquipment()
  const { data, isLoading } = useEquipmentList(filters as FilterEquipmentDTO)
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id })

  const onDelete = (id: number) => deleteData.mutate(id)

  const equipmentTableColumns: ColumnDef<Equipment>[] = [
    {
      accessorKey: 'equipmentType',
      header: 'Qurilmaning turi',
      maxSize: -10,
      cell: ({ row }) => getEquipmentTypeLabel(row.original.equipmentType),
    },
    {
      accessorKey: 'name',
      maxSize: -10,
      header: 'Qurilmaning quyi  turi',
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
      data={data || []}
      isLoading={isLoading}
      columns={equipmentTableColumns}
      className="h-[calc(100svh-220px)]"
    />
  )
}

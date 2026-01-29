import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { UIModeEnum } from '@/shared/types/ui-types'
import { useFilters } from '@/shared/hooks/use-filters'
import {
  type CentralApparatus,
  type FilterCentralApparatusDTO,
  useCentralApparatusListQuery,
  useDeleteCentralApparatus,
} from '@/entities/admin/central-apparatus'
import { useCentralApparatusDrawer } from '@/shared/hooks/entity-hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'

export function CentralApparatusList() {
  const { filters } = useFilters()
  const { t } = useTranslation('common')
  const { onOpen } = useCentralApparatusDrawer()
  const { data, isLoading } = useCentralApparatusListQuery(filters as FilterCentralApparatusDTO)
  const deleteData = useDeleteCentralApparatus()

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id })

  const onDelete = (id: number) => deleteData.mutate(id)

  const columns: ColumnDef<CentralApparatus>[] = [
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      maxSize: -10,
      header: t('name'),
    },
    {
      id: 'actions',
      // maxSize: 20,
      // minSize: 10,
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

  return <DataTable isPaginated data={data || []} columns={columns} isLoading={isLoading} />
}

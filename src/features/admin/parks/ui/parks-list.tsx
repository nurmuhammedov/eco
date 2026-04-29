import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import { UIModeEnum } from '@/shared/types/ui-types'
import { useFilters } from '@/shared/hooks/use-filters'
import { useParkDrawer } from '@/shared/hooks/entity-hooks'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useParksQuery, useDeletePark, Park, FilterParkDTO } from '@/entities/admin/park'

export function ParksList() {
  const { filters } = useFilters({}, { defaultSize: 20 })
  const { data, isLoading } = useParksQuery(filters as FilterParkDTO)
  const { t } = useTranslation('common')
  const { onOpen } = useParkDrawer()
  const deletePark = useDeletePark()

  const onEdit = (park: Park) => onOpen(UIModeEnum.EDIT, park)
  const onDelete = (id: number) => deletePark.mutate(id)

  const columns: ColumnDef<Park>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'regionName',
      header: t('region'),
    },
    {
      accessorKey: 'districtName',
      header: t('district'),
    },
    {
      accessorKey: 'address',
      header: t('address'),
    },
    {
      accessorKey: 'location',
      header: t('location'),
      cell: ({ row }) => row.original.location || '-',
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          showDelete
          row={row}
          onEdit={(row) => onEdit(row.original)}
          onDelete={(row) => onDelete(row.original.id)}
        />
      ),
    },
  ]

  return <DataTable isPaginated data={data || []} isLoading={isLoading} columns={columns} />
}

import {
  FilterHazardousFacilityCategoryDTO,
  HazardousFacilityCategoryTableItem,
  useDeleteHazardousFacilityCategory,
  useHazardousFacilityCategoryListQuery,
} from '@/entities/admin/hazardous-facility-category'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useHazardousFacilityCategoryDrawer } from '@/shared/hooks/entity-hooks'
import { useFilters } from '@/shared/hooks/use-filters'
import { UIModeEnum } from '@/shared/types/ui-types'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function HazardousFacilityCategoryList() {
  const { filters } = useFilters()
  const { t } = useTranslation('common')
  const { onOpen } = useHazardousFacilityCategoryDrawer()
  const { data, isLoading } = useHazardousFacilityCategoryListQuery(filters as FilterHazardousFacilityCategoryDTO)

  const deleteData = useDeleteHazardousFacilityCategory()
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id })

  const onDelete = (id: number) => deleteData.mutate(id)

  const columns: ColumnDef<HazardousFacilityCategoryTableItem>[] = [
    {
      accessorKey: 'name',
      header: t('hazardous_facilities_category'),
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

  return <DataTable isPaginated columns={columns} data={data || []} isLoading={isLoading} />
}

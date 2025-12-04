import {
  FilterHazardousFacilityTypeDTO,
  HazardousFacilityTypeTableItem,
  useDeleteHazardousFacilityType,
  useHazardousFacilityTypeListQuery,
} from '@/entities/admin/hazardous-facility-type'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useHazardousFacilityTypeDrawer } from '@/shared/hooks/entity-hooks'
import { useFilters } from '@/shared/hooks/use-filters'
import { UIModeEnum } from '@/shared/types/ui-types'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function HazardousFacilityTypeList() {
  const { filters } = useFilters()
  const { t } = useTranslation('common')
  const { onOpen } = useHazardousFacilityTypeDrawer()
  const { data, isLoading } = useHazardousFacilityTypeListQuery(filters as FilterHazardousFacilityTypeDTO)

  const deleteData = useDeleteHazardousFacilityType()
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id })

  const onDelete = (id: number) => deleteData.mutate(id)

  const columns: ColumnDef<HazardousFacilityTypeTableItem>[] = [
    {
      accessorKey: 'name',
      header: t('hazardous_facility_type'),
    },
    {
      accessorKey: 'description',
      header: t('hazardous_facility_type_description'),
      maxSize: -10,
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
      columns={columns}
      data={data || []}
      isLoading={isLoading}
      className="h-[calc(100svh-270px)]"
    />
  )
}

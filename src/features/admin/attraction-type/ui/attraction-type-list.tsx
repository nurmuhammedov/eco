import { useDeleteAttractionType } from '@/entities/admin/attraction-type/hooks/use-attraction-type-mutations'
import { useAttractionTypeList } from '@/entities/admin/attraction-type/hooks/use-attraction-type-query'
import { AttractionType } from '@/entities/admin/attraction-type/models/attraction-type.types'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { useAttractionTypeDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types/ui-types'
import { ColumnDef } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { useCustomSearchParams } from '@/shared/hooks'

export function AttractionTypeList() {
  const { t } = useTranslation('common')
  const { onOpen } = useAttractionTypeDrawer()
  const { paramsObject } = useCustomSearchParams()
  const { data, isLoading } = useAttractionTypeList({ page: paramsObject?.page || 1, size: paramsObject?.size || 10 })
  const { mutate: deleteAttractionType } = useDeleteAttractionType()

  const columns: ColumnDef<AttractionType>[] = [
    {
      accessorKey: 'childEquipment',
      maxSize: -10,
      header: t('Atraksion turi'),
    },
    {
      accessorKey: 'name',
      maxSize: -10,
      header: t('Atraksion tipi'),
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          row={row}
          showDelete
          onEdit={() => onOpen(UIModeEnum.EDIT, { id: row.original.id })}
          onDelete={() => deleteAttractionType(row.original.id)}
        />
      ),
    },
  ]

  return <DataTable isPaginated data={data?.data || []} columns={columns} isLoading={isLoading} />
}

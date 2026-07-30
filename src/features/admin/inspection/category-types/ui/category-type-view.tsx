import { Description } from '@/shared/components/common/description'
import { CategoryType, Checklist, useDeleteChecklist } from '@/entities/admin/inspection'
import { inspectionCategoryOptions } from '@/entities/admin/inspection/shared/static-options/inspection-category-options'
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks'
import { UIModeEnum } from '@/shared/types'

interface CategoryTypeViewProps {
  data: CategoryType | null
  checklistsData?: Checklist[]
  isChecklistsLoading?: boolean
}

export const CategoryTypeView = ({ data, checklistsData = [], isChecklistsLoading = false }: CategoryTypeViewProps) => {
  const { onOpen } = useChecklistDrawer()
  const deleteItem = useDeleteChecklist()

  if (!data) return null

  const categoryName = inspectionCategoryOptions?.find((i) => i.id == data.type)?.name || '-'

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id })
  const onDelete = (id: number) => deleteItem.mutate(id)

  const columns: ColumnDef<Checklist>[] = [
    {
      accessorKey: 'orderNumber',
      header: 'Navbat raqami',
      size: 100,
      className: 'text-center',
      headerClassName: 'text-center',
    } as any,
    { accessorKey: 'question', header: 'Savol' },
    { accessorKey: 'negative', header: "Yo'q belgilanganda matn" },
    { accessorKey: 'corrective', header: 'Chora-tadbir matni' },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          showDelete
          row={row}
          onEdit={(row) => onEdit(row.original.id!)}
          onDelete={(row) => onDelete(row.original.id!)}
        />
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <Description>
        <Description.Item key="category" label="Kategoriya">
          {categoryName}
        </Description.Item>
        <Description.Item key="type" label="Tekshiruv turi">
          {data.name}
        </Description.Item>
      </Description>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-medium">Savollar ro'yxati</h3>
        <DataTable data={checklistsData || []} isLoading={isChecklistsLoading} columns={columns} />
      </div>
    </div>
  )
}

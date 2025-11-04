import { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useChecklistDrawer } from '@/shared/hooks/entity-hooks';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useChecklistsQuery, useDeleteChecklist, Checklist } from '@/entities/admin/inspection';
import { useCustomSearchParams } from '@/shared/hooks';
import { inspectionCategoryOptions } from '@/entities/admin/inspection/shared/static-options/inspection-category-options';

export function ChecklistList() {
  const { onOpen } = useChecklistDrawer();
  const { paramsObject } = useCustomSearchParams();
  const { data, isLoading } = useChecklistsQuery({ page: paramsObject?.page || 1, size: paramsObject?.size || 10 });
  const deleteItem = useDeleteChecklist();

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });
  const onDelete = (id: number) => deleteItem.mutate(id);
  const onView = (id: number) => onOpen(UIModeEnum.VIEW, { id });

  const columns: ColumnDef<Checklist>[] = [
    {
      header: 'Kategoriya',
      cell: ({ row }) => inspectionCategoryOptions?.find((i) => i?.id == row.original.category)?.name || '',
    },
    { accessorKey: 'categoryTypeName', header: 'Tekshiruv turi' },
    { accessorKey: 'orderNumber', header: 'Navbat raqami' },
    { accessorKey: 'question', header: 'Savol' },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          showDelete
          row={row}
          onEdit={(row) => onEdit(row.original.id!)}
          onDelete={(row) => onDelete(row.original.id!)}
          onView={(row) => onView(row.original.id!)}
        />
      ),
    },
  ];

  return (
    <DataTable
      isPaginated
      data={data || []}
      isLoading={isLoading}
      columns={columns}
      className="h-[calc(100svh-270px)]"
    />
  );
}

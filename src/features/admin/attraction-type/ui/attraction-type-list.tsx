import { useDeleteAttractionType } from '@/entities/admin/attraction-type/hooks/use-attraction-type-mutations';
import { useAttractionTypeList } from '@/entities/admin/attraction-type/hooks/use-attraction-type-query';
import { AttractionType } from '@/entities/admin/attraction-type/models/attraction-type.types';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useAttractionTypeDrawer } from '@/shared/hooks/entity-hooks';
import { UIModeEnum } from '@/shared/types/ui-types';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export function AttractionTypeList() {
  const { t } = useTranslation('common');
  const { onOpen } = useAttractionTypeDrawer();
  const { data, isLoading } = useAttractionTypeList({});
  const { mutate: deleteAttractionType } = useDeleteAttractionType();

  const columns: ColumnDef<AttractionType>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'childEquipment',
      header: t('Atraksion turi'),
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
      size: 100,
    },
  ];

  return (
    <DataTable
      isPaginated
      data={data?.data || []}
      columns={columns}
      isLoading={isLoading}
      className="h-[calc(100svh-220px)]"
    />
  );
}

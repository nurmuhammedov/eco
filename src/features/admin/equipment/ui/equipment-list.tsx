import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useEquipmentTypeLabel } from '@/shared/hooks';
import { useFilters } from '@/shared/hooks/use-filters';
import { useEquipmentDrawer } from '@/shared/hooks/entity-hooks';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { Equipment, FilterEquipmentDTO, useDeleteEquipment, useEquipmentList } from '@/entities/admin/equipment';

export function EquipmentList() {
  const { filters } = useFilters();
  const { onOpen } = useEquipmentDrawer();
  const { t } = useTranslation('common');

  const getEquipmentTypeLabel = useEquipmentTypeLabel();

  const deleteData = useDeleteEquipment();
  const { data, isLoading } = useEquipmentList(filters as FilterEquipmentDTO);
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteData.mutate(id);

  const equipmentTableColumns: ColumnDef<Equipment>[] = [
    {
      accessorKey: 'name',
      header: t('name'),
    },
    {
      accessorKey: 'equipmentType',
      header: 'Qurilmaning quyi turi',
      cell: ({ row }) => getEquipmentTypeLabel(row.original.equipmentType),
    },
    {
      id: 'actions',
      maxSize: 40,
      enableResizing: false,
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
  ];

  return (
    <DataTable
      data={data || []}
      isLoading={isLoading}
      columns={equipmentTableColumns}
      className="h-[calc(100svh-220px)]"
    />
  );
}

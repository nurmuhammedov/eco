import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { Equipment, FilterEquipmentDTO, useDeleteEquipment, useEquipmentList } from '@/entities/admin/equipment';

export function EquipmentList() {
  const { filters } = useFilters();
  const { onOpen } = useDistrictDrawer();
  const { t } = useTranslation('common');
  const deleteData = useDeleteEquipment();
  const { data, isLoading } = useEquipmentList(filters as FilterEquipmentDTO);
  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteData.mutate(id);

  const districtTableColumns: ColumnDef<Equipment>[] = [
    {
      maxSize: 20,
      accessorKey: 'number',
      header: t('sequence_number'),
      cell: (cell) => cell.row.index + 1,
    },
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      header: t('name'),
    },
    {
      enablePinning: true,
      accessorKey: 'equipmentType',
      enableSorting: false,
      header: 'Jihoz turi',
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
      isPaginated
      data={data || []}
      isLoading={isLoading}
      columns={districtTableColumns}
      className="h-[calc(100svh-270px)]"
    />
  );
}

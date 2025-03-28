import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { type CentralApparatus } from '@/entities/admin/central-apparatus';
import { useTerritorialDepartmentsDrawer } from '@/shared/hooks/entity-hooks';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';
import {
  FilterTerritorialDepartmentsDTO,
  useDeleteTerritorialDepartments,
  useTerritorialDepartmentsQuery,
} from '@/entities/admin/territorial-departments';

export function TerritorialDepartmentsList() {
  const { filters } = useFilters();
  const { t } = useTranslation('common');
  const { onOpen } = useTerritorialDepartmentsDrawer();
  const { data, isLoading } = useTerritorialDepartmentsQuery(
    filters as FilterTerritorialDepartmentsDTO,
  );

  const deleteData = useDeleteTerritorialDepartments();

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteData.mutate(id);

  const columns: ColumnDef<CentralApparatus>[] = [
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
      id: 'actions',
      maxSize: 20,
      minSize: 10,
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
      columns={columns}
      isLoading={isLoading}
      className="h-[calc(100svh-270px)]"
    />
  );
}

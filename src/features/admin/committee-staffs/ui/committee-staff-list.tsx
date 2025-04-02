import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { useCommitteeStaffsDrawer } from '@/shared/hooks/entity-hooks';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';
import {
  CommitteeStaff,
  FilterCommitteeStaffDTO,
  useCommitteeStaffListQuery,
  useDeleteCommitteeStaff,
} from '@/entities/admin/committee-staffs';

export function CommitteeStaffList() {
  const { filters } = useFilters();
  const { t } = useTranslation('common');
  const { onOpen } = useCommitteeStaffsDrawer();
  const { data, isLoading } = useCommitteeStaffListQuery(
    filters as FilterCommitteeStaffDTO,
  );
  const deleteData = useDeleteCommitteeStaff();

  const onEdit = (id: number) => onOpen(UIModeEnum.EDIT, { id });

  const onDelete = (id: number) => deleteData.mutate(id);

  const columns: ColumnDef<CommitteeStaff>[] = [
    {
      maxSize: 50,
      minSize: 50,
      accessorKey: 'number',
      header: t('sequence_number'),
      cell: (cell) => cell.row.index + 1,
    },
    {
      accessorKey: 'name',
      enableSorting: false,
      minSize: 250,
      header: t('short.full_name'),
    },
    {
      minSize: 250,
      accessorKey: 'pin',
      enableSorting: false,
      header: t('short.pin'),
    },
    {
      minSize: 200,
      accessorKey: 'pin',
      enableSorting: false,
      header: t('position'),
    },
    {
      accessorKey: 'pin',
      enableSorting: false,
      minSize: 300,
      header: t('committee_division_department'),
    },
    {
      minSize: 150,
      accessorKey: 'pin',
      enableSorting: false,
      header: t('role'),
    },
    {
      minSize: 200,
      accessorKey: 'pin',
      header: t('status'),
    },
    {
      minSize: 200,
      accessorKey: 'pin',
      header: t('phone'),
    },
    {
      id: 'actions',
      maxSize: 200,
      minSize: 100,
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

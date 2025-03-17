import { useUI } from '@/entities/ui';
import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { District } from '@/entities/admin/district/types';
import { useDistrictsPaged } from '@/entities/admin/district/api';
import {
  DataTable,
  DataTableColumnHeader,
  DataTableRowActions,
} from '@/shared/components/common/data-table';

export function DistrictTable() {
  const { onOpen } = useUI();
  const { filters } = useFilters();
  const { data } = useDistrictsPaged(filters);

  const onEdit = (id: number) => {
    onOpen(UIModeEnum.EDIT, 'district-drawer', id);
  };

  const list: District[] = [
    {
      id: 1,
      name: 'Mirobod tumani',
      region: {
        id: 1,
        name: 'Toshkent shahri',
      },
    },
    {
      id: 2,
      name: 'Chilonzor tumani',
      region: { id: 1, name: 'Toshkent shahri' },
    },
    {
      id: 3,
      name: 'Yashnobod tumani',
      region: { id: 1, name: 'Toshkent shahri' },
    },
    {
      id: 4,
      name: 'Bektemir tumani',
      region: { id: 1, name: 'Toshkent shahri' },
    },
    {
      id: 4,
      name: 'Uchtepa tumani',
      region: { id: 1, name: 'Toshkent shahri' },
    },
  ];

  const districtTableColumns: ColumnDef<District>[] = [
    {
      accessorKey: 'id',
      maxSize: 20,
      enableResizing: true,
      header: '№',
      size: 10,
      enableSorting: false,
      enableHiding: false,
    },
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nomi" />
      ),
    },
    {
      enableSorting: false,
      accessorKey: 'region.name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Viloyat" />
      ),
      cell: ({ row }) => row.original.region.name,
    },
    {
      id: 'actions',
      size: 10,
      minSize: 10,
      maxSize: 40,
      enableResizing: false,
      cell: ({ row }) => (
        <DataTableRowActions
          showEdit
          showView
          row={row}
          showDelete
          onEdit={(row) => onEdit(row.original.id)}
          onView={(row) => console.log(row.original.id)}
          onDelete={(row) => console.log(row.original.id)}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={list || []}
      namespace="districts"
      pageCount={data?.totalPages}
      columns={districtTableColumns}
      className="h-[calc(100svh-17.5rem)]"
    />
  );
}

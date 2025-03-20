import { ColumnDef } from '@tanstack/react-table';
import { UIModeEnum } from '@/shared/types/ui-types';
import { useFilters } from '@/shared/hooks/use-filters';
import { District } from '@/entities/admin/district/district.types.ts';
import { useDistrictsQuery } from '@/entities/admin/district';
import { useDistrictDrawer } from '@/shared/hooks/entity-hooks';
import {
  DataTable,
  DataTableRowActions,
} from '@/shared/components/common/data-table';
import { useTranslation } from 'react-i18next';

export function DistrictTable() {
  const { t } = useTranslation('common');
  const { filters } = useFilters();
  const { onOpen } = useDistrictDrawer();
  const { data } = useDistrictsQuery(filters);

  const onEdit = (id: number) => {
    onOpen(UIModeEnum.EDIT, { id });
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
      header: '№',
    },
    {
      enablePinning: true,
      accessorKey: 'name',
      enableSorting: false,
      header: t('name'),
    },
    {
      enableSorting: false,
      accessorKey: 'region.name',
      header: t('region_name'),
      cell: ({ row }) => row.original.region.name,
    },
    {
      accessorKey: 'region.code',
      header: t('region_code'),
      cell: () => '1703',
    },
    {
      id: 'actions',
      maxSize: 20,
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

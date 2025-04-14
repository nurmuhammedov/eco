import { useTranslation } from 'react-i18next';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';

interface ApplicationTableProps {
  data: any;
  onViewApplication: (id: string) => void;
}

export const ApplicationTable = ({ data, onViewApplication }: ApplicationTableProps) => {
  const { t } = useTranslation('common');

  const handleViewApplication = (id: string) => {
    onViewApplication(id);
  };
  const columns: ColumnDef<any>[] = [
    {
      maxSize: 30,
      accessorKey: 'number',
      header: t('sequence_number'),
      cell: (cell) => cell.row.index + 1,
    },
    {
      accessorKey: 'name',
      header: 'Ариза рақами',
    },
    {
      accessorKey: 'name',
      header: 'Ариза санаси',
    },
    {
      accessorKey: 'name',
      header: 'Ариза тури',
    },
    {
      accessorKey: 'name',
      header: 'Қўмита маъсул бўлими',
    },
    {
      accessorKey: 'name',
      header: 'Ижрочи ҳудудий бошқарма',
    },
    {
      accessorKey: 'name',
      header: 'Маъсул ижрочи',
    },
    {
      accessorKey: 'name',
      header: 'Ижро муддати',
    },
    {
      accessorKey: 'name',
      header: 'Ариза ҳолати',
    },
    {
      id: 'actions',
      maxSize: 20,
      minSize: 10,
      cell: ({ row }) => (
        <DataTableRowActions showView row={row} showDelete onView={(row) => handleViewApplication(row.original.id)} />
      ),
    },
  ];
  return <DataTable isPaginated data={data || []} columns={columns} className="h-[calc(100svh-270px)]" />;
};

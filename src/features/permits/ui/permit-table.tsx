import { Permit } from '@/entities/permit';
import { DataTable } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';

interface PermitTableProps {
  data: Permit[];
}

export const PermitTable = ({ data }: PermitTableProps) => {
  const columns: ColumnDef<Permit>[] = [
    {
      accessorKey: 'organizationStir',
      header: 'Tashkilotning STIR (JSHSHIR)',
    },
    {
      accessorKey: 'organizationName',
      header: 'Tashkilot nomi',
    },
    {
      accessorKey: 'documentType',
      header: 'Hujjat turi',
    },
    {
      accessorKey: 'documentName',
      header: 'Hujjat nomi',
    },
    {
      accessorKey: 'registrationNumber',
      header: 'Ro‘yxatga olingan raqami',
    },
    {
      accessorKey: 'registrationDate',
      header: 'Ro‘yxatga olingan sanasi',
    },
    {
      id: 'actions',
      header: 'Amallar',
      enableResizing: false,
    },
  ];

  return <DataTable showNumeration={true} columns={columns} data={data} className="h-[calc(100svh-320px)]" />;
};

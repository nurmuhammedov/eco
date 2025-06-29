import { EmployeeLevel } from '@/entities/attestation/model/attestation.types.ts';
import { DataTable } from '@/shared/components/common/data-table';
import { getDate } from '@/shared/utils/date.ts';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

interface Employee {
  pin: string;
  level: EmployeeLevel;
  certDate: string;
  fullName: string;
  certNumber: string;
  profession: string;
  certExpiryDate: string;
  dateOfEmployment: string;
  ctcTrainingToDate: string;
  ctcTrainingFromDate: string;
}

const EmployeesList = ({ data }: { data: Employee[] }) => {
  const { t } = useTranslation(['common']);

  const levelTranslations: Record<EmployeeLevel, string> = {
    [EmployeeLevel.LEADER]: t('attestation.LEADER'),
    [EmployeeLevel.TECHNICIAN]: t('attestation.TECHNICIAN'),
    [EmployeeLevel.EMPLOYEE]: t('attestation.EMPLOYEE'),
  };

  const columns: ColumnDef<Employee>[] = [
    {
      header: '№',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'fullName',
      header: 'Xodim FIO',
    },
    {
      accessorKey: 'dateOfEmployment',
      header: 'Ishga kirgan sanasi',
      cell: ({ row }) => getDate(row.original.dateOfEmployment),
    },
    {
      accessorKey: 'level',
      header: 'Lavozimi',
      cell: ({ row }) => levelTranslations[row.original.level] || row.original.level,
    },
    {
      accessorKey: 'pin',
      header: 'JSHIR',
    },
    {
      accessorKey: 'profession',
      header: 'Kasbi',
    },
    {
      accessorKey: 'certNumber',
      header: 'Sertifikat raqami',
    },
    {
      accessorKey: 'certDate',
      header: 'Sertifikat sanasi',
      cell: ({ row }) => getDate(row.original.certDate),
    },
    {
      accessorKey: 'certExpiryDate',
      header: 'Sertifikat muddati',
      cell: ({ row }) => getDate(row.original.certExpiryDate),
    },
    {
      accessorKey: 'ctcTrainingFromDate',
      header: '“Kontexnazorato‘quv” DMda o‘qigan muddati (dan)',
      cell: ({ row }) => getDate(row.original.ctcTrainingFromDate),
    },
    {
      accessorKey: 'ctcTrainingToDate',
      header: '“Kontexnazorato‘quv” DMda o‘qigan muddati (gacha)',
      cell: ({ row }) => getDate(row.original.ctcTrainingToDate),
    },
  ];

  return <DataTable columns={columns} data={data || []} />;
};

export default EmployeesList;

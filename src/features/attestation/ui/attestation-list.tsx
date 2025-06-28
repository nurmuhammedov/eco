import { useAttestationList } from '@/entities/attestation/hooks/use-attestation-list';
import { AttestationReportDto, AttestationView } from '@/entities/attestation/model/attestation.types';
import { UserRoles } from '@/entities/user';
import { DataTable } from '@/shared/components/common/data-table';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/shared/hooks/use-auth';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';

export const AttestationList: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading } = useAttestationList({});

  const columnsForLegalIndividual: ColumnDef<AttestationView>[] = [
    { accessorKey: 'employeeName', header: 'Xodim F.I.SH.' },
    { accessorKey: 'employeePin', header: 'JSHSHIR' },
    { accessorKey: 'employeeLevel', header: 'Lavozimi' },
    { accessorKey: 'hfName', header: 'XICHО nomi' },
    { accessorKey: 'expiryDate', header: 'Attestatsiyadan o‘tgan muddati' },
    { accessorKey: 'status', header: 'Attestatsiya holati', cell: ({ row }) => <Badge>{row.original.status}</Badge> },
  ];

  const columnsForOthers: ColumnDef<AttestationReportDto>[] = [
    { accessorKey: 'legalName', header: 'Tashkilot nomi' },
    { accessorKey: 'legalTin', header: 'Tashkilot STIR' },
    { accessorKey: 'legalAddress', header: 'Tashkilot manzili' },
    { accessorKey: 'hfName', header: 'XICHО nomi' },
    { accessorKey: 'hfAddress', header: 'XICHО manzili' },
    { accessorKey: 'totalEmployees', header: 'Jami xodimlar soni' },
    { accessorKey: 'leadersPassed', header: 'Attestatsiyadan o‘tgan rahbar xodimlar' },
    { accessorKey: 'techniciansPassed', header: 'Attestatsiyadan o‘tgan muhandis-texnik xodimlar' },
    { accessorKey: 'employeesPassed', header: 'Attestatsiyadan o‘tgan oddiy xodimlar' },
    { accessorKey: 'failedEmployees', header: 'Attestatsiyadan o‘tmay qolgan xodimlar' },
  ];

  const columns =
    user?.role === UserRoles.LEGAL || user?.role === UserRoles.INDIVIDUAL
      ? columnsForLegalIndividual
      : columnsForOthers;

  return <DataTable columns={columns as any} data={data?.content || []} isLoading={isLoading} />;
};

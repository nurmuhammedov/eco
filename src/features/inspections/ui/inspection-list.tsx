import { useInspections } from '@/entities/inspection/hooks/use-inspection-query';
import { Inspection } from '@/entities/inspection/models/inspection.types';
import { DataTable } from '@/shared/components/common/data-table';
import { Button } from '@/shared/components/ui/button';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useAuth } from '@/shared/hooks/use-auth';
import { InspectionStatus, InspectionSubMenuStatus } from '@/widgets/inspection/ui/inspection-widget';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRoles } from '@/entities/user';

export const InspectionList: React.FC = () => {
  const navigate = useNavigate();
  const {
    paramsObject: { status = InspectionStatus.ALL, subStatus = InspectionSubMenuStatus.ASSIGNED, ...rest },
  } = useCustomSearchParams();
  const { user } = useAuth();
  const { data: inspections, isLoading } = useInspections({
    ...rest,
    status: [UserRoles.LEGAL, UserRoles?.INSPECTOR]?.includes(user?.role as unknown as UserRoles)
      ? subStatus
      : status === InspectionStatus.ALL
        ? undefined
        : status == InspectionStatus.ASSIGNED
          ? subStatus
          : status,
  });
  const handleView = (row: Inspection) => {
    navigate(`/inspections/info?inspectionId=${row.id}&tin=${row.tin}&name=${row.legalName}`);
  };

  const columns: ColumnDef<Inspection>[] = [
    {
      header: 'Tashkilot nomi',
      accessorKey: 'legalName',
    },
    {
      header: 'STIR',
      accessorKey: 'tin',
    },
    {
      header: 'Tashkilot joylashgan Viloyat',
      accessorKey: 'regionName',
    },
    {
      header: 'Tashkilot joylashgan Tuman',
      accessorKey: 'districtName',
    },
    {
      header: 'Tashkilot joylashgan manzili',
      accessorKey: 'legalAddress',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => handleView(row.original)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      isPaginated
      data={inspections || []}
      columns={columns as unknown as any}
      isLoading={isLoading}
      className="h-[calc(100vh-280px)]"
    />
  );
};

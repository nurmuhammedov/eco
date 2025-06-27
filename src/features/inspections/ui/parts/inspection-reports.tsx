import AddReportForm from '@/features/inspections/ui/parts/add-report-form.tsx';
import { useInspectionReports } from '@/features/inspections/hooks/use-inspection-reports.ts';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { useCustomSearchParams } from '@/shared/hooks';
import { UserRoles } from '@/entities/user';
import { DataTable } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/shared/components/ui/badge.tsx';
import { Button } from '@/shared/components/ui/button.tsx';
import { Eye } from 'lucide-react';
import ReportExecutionModal from '@/features/inspections/ui/parts/report-execution-modal.tsx';
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';

const InspectionReports = () => {
  const { data, isLoading } = useInspectionReports();
  const { user } = useAuth();
  const { addParams, paramsObject } = useCustomSearchParams();

  const isValidInterval = paramsObject?.intervalId == user?.interval?.id;
  const [id, setId] = useState<any>(null);
  const [inspectionTitle, setInspectionTitle] = useState<string>('');
  const currentTab = paramsObject?.eliminated;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Yaratilgan sana',
      size: 80,
      cell: ({ row }) => format(row.original?.date, 'dd.MM.yyyy'),
    },
    {
      accessorKey: 'deadline',
      size: 80,
      header: 'Tugatish muddati',
      cell: ({ row }) => format(row.original?.deadline, 'dd.MM.yyyy'),
    },
    {
      accessorKey: 'assignedTasks',
      header: 'Bajariladigan vazifalar',
      size: 200,
    },
    {
      accessorKey: 'inspectorName',
      header: 'Inspektor F.I.SH',
    },
    {
      accessorKey: 'eliminated',
      header: 'Status',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          {row.original?.eliminated && <Badge variant="success">Qabul qilindi</Badge>}
          <Button
            onClick={() => {
              setId(row.original?.id);
              setInspectionTitle(row?.original?.assignedTasks || '');
            }}
            variant="outline"
            size="iconSm"
          >
            <Eye />
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center ">
        <Tabs
          value={currentTab || 'false'}
          onValueChange={(val) => {
            addParams({ eliminated: val, page: 1 });
          }}
        >
          <TabsList className="bg-[#EDEEEE]">
            <TabsTrigger value="true">eliminated</TabsTrigger>
            <TabsTrigger value="false">not_eliminated</TabsTrigger>
          </TabsList>
        </Tabs>
        {isValidInterval && user?.role === UserRoles.INSPECTOR && <AddReportForm />}
      </div>
      <div>
        <DataTable isLoading={isLoading} columns={columns} data={data || []} />
      </div>
      <ReportExecutionModal
        description={inspectionTitle}
        id={id}
        closeModal={() => {
          setId(null);
          setInspectionTitle('');
        }}
      />
    </div>
  );
};

export default InspectionReports;

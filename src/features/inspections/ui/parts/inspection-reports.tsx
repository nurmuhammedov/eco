import AddReportForm from '@/features/inspections/ui/parts/add-report-form.tsx';
import { useInspectionReports } from '@/features/inspections/hooks/use-inspection-reports.ts';
import { useAuth } from '@/shared/hooks/use-auth.ts';
import { useCustomSearchParams } from '@/shared/hooks';
import { UserRoles } from '@/entities/user';
import { DataTable } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';

const InspectionReports = () => {
  const { data } = useInspectionReports();
  console.log(data);
  const { user } = useAuth();
  const { paramsObject } = useCustomSearchParams();
  const isValidInterval = paramsObject?.intervalId == user?.interval?.id;

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'reportInfo',
      header: 'reportInfo',
    },
    {
      accessorKey: 'reportInfo',
      header: 'reportInfo',
    },
    {
      accessorKey: 'reportInfo',
      header: 'reportInfo',
    },
  ];
  return (
    <div>
      {isValidInterval && user?.role === UserRoles.INSPECTOR && (
        <div className="flex justify-end mb-4">
          <AddReportForm />
        </div>
      )}
      <div>
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  );
};

export default InspectionReports;

import { DataTable } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';

export const AccreditationList = () => {
  const columns: ColumnDef<any>[] = [];

  return <DataTable columns={columns} data={[]} className="h-[calc(100svh-220px)]" />;
};

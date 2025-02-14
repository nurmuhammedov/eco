import tasks from '../data/tasks.json';
import { fetchApplications } from '@/entities/user';
import { dataTableColumns } from './data-table-columns';
import { DataTable } from '@/shared/components/common/data-table';

export default function Application() {
  const { data } = fetchApplications();
  return (
    <DataTable
      data={tasks}
      namespace="applications"
      columns={dataTableColumns}
      pageCount={data.totalPages}
    />
  );
}

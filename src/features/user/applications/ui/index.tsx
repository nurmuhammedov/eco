import tasks from '../data/tasks.json';
import { dataTableColumns } from './data-table-columns';
import { DataTable } from '@/shared/components/common/data-table';

export default function Application() {
  return <DataTable data={tasks} columns={dataTableColumns} />;
}

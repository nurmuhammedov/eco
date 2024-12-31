import { DataTable } from '@/modules/admin/appeals/components/data-table.tsx';
import { columns } from '../components/columns';
import tasks from '../data/tasks.json';

export default function Appeals() {
  return <DataTable data={tasks} columns={columns} />;
}

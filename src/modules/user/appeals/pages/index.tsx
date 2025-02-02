import { DataTable } from '@/modules/user/appeals/components/data-table.tsx';
import { columns } from '../components/columns';
import tasks from '../data/tasks.json';

export default function Index() {
  return <DataTable data={tasks} columns={columns} />;
}

import { ExpertiseTable } from '@/features/expertise/ui/expertise-table';
import { Button } from '@/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';

const OrganizationsPage = () => {
  return (
    <>
      <div className="flex justify-end items-center mb-3">
        <Button disabled={true}>
          <PlusCircle className="mr-2 h-4 w-4" /> Qo‘shish
        </Button>
      </div>
      <ExpertiseTable />
    </>
  );
};

export default OrganizationsPage;

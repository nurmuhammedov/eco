import { useObjectList } from '@/features/inspections/hooks/use-object-list.ts';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import useCustomSearchParams from '../../../../shared/hooks/api/useSearchParams.ts';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/shared/components/ui/button.tsx';
import { Eye } from 'lucide-react';
import { DataTable } from '@/shared/components/common/data-table';
import { useNavigate } from 'react-router-dom';

const ObjectsList = () => {
  const { addParams, paramsObject } = useCustomSearchParams();
  const currentTab = paramsObject?.type || 'hf';
  const { data, isLoading } = useObjectList();
  const navigate = useNavigate();

  const columns: ColumnDef<any>[] = [
    {
      header: 'Nomi',
      accessorKey: 'name',
    },
    {
      header: 'Manzil',
      accessorKey: 'address',
    },
    {
      header: 'Ro‘yxatga olish raqami',
      accessorKey: 'registryNumber',
    },
    {
      header: ' Xavfni tahlil qilish bali',
      accessorKey: 'score',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            navigate(
              `/inspections/detail?id=${row.original?.objectId}&type=${currentTab}&tin=${paramsObject?.tin}&intervalId=${paramsObject?.intervalId}`,
              {},
            )
          }
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="select-none mb-4">
        <Tabs
          value={currentTab}
          onValueChange={(val) => {
            addParams({ type: val, page: 1 });
          }}
        >
          <TabsList className="bg-[#EDEEEE]">
            <TabsTrigger value="hf">XIChO</TabsTrigger>
            <TabsTrigger value="irs">INM</TabsTrigger>
            <TabsTrigger value="elevator">Lift</TabsTrigger>
            <TabsTrigger value="attraction">Attraksion</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <DataTable isPaginated data={data || []} columns={columns as unknown as any} isLoading={isLoading} />
    </div>
  );
};

export default ObjectsList;

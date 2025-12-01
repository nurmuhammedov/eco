import { DataTable } from '@/shared/components/common/data-table';
import { usePaginatedData } from '@/shared/hooks';
import { getDate } from '@/shared/utils/date';
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import { GoBack } from '@/shared/components/common';
import { TabsLayout } from '@/shared/layouts';
import { useCustomSearchParams } from '@/shared/hooks';
import FileLink from '@/shared/components/common/file-link';

interface IEquipmentAppeal {
  id: string;
  appealNumber: string;
  type: 'APPEAL' | 'COMPLAINT' | 'SUGGESTION';
  message: string;
  createdAt: string;
  fullName?: string;
  phoneNumber?: string;
  filePath?: string;
}

const appealTypeTranslations = {
  APPEAL: 'Murojaat',
  COMPLAINT: 'Shikoyat',
  SUGGESTION: 'Taklif',
};

export const RegisterEquipmentAppealList = () => {
  const { id: equipmentId } = useParams<{ id: string }>();
  const { paramsObject, addParams } = useCustomSearchParams();
  const activeTab = paramsObject.type || 'ALL';

  const { data } = usePaginatedData<IEquipmentAppeal>('/inquiries', {
    ...paramsObject,
    belongId: equipmentId,
    type: activeTab !== 'ALL' ? activeTab : '',
  });

  const columns: ColumnDef<IEquipmentAppeal>[] = [
    {
      accessorKey: 'registryNumber',
      header: 'Murojaat raqami',
    },
    {
      header: 'Murojaat sanasi',
      accessorFn: (row) => getDate(row.createdAt),
    },
    {
      header: 'Murojaat turi',
      accessorFn: (row) => appealTypeTranslations[row.type] || row.type,
    },
    {
      accessorKey: 'fullName',
      header: 'Yuboruvchi F.I.O.',
      cell: ({ row }) => row.original.fullName || '-',
    },
    {
      accessorKey: 'phoneNumber',
      header: 'Telefon raqami',
      cell: ({ row }) => row.original.phoneNumber || '-',
    },
    {
      accessorKey: 'message',
      header: 'Murojaat matni',
      cell: ({ row }) => (
        <span title={row.original.message}>
          {row.original.message.length > 50 ? `${row.original.message.substring(0, 50)}...` : row.original.message}
        </span>
      ),
    },
    {
      header: 'Biriktirilgan fayl',
      cell: ({ row }) => (row.original.filePath ? <FileLink url={row.original.filePath} /> : '-'),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <GoBack title="Qurilmaga yuborilgan murojaatlar" />
      </div>

      <TabsLayout
        activeTab={activeTab}
        tabs={[
          { id: 'ALL', name: 'Barchasi' },
          { id: 'APPEAL', name: 'Murojaatlar' },
          { id: 'COMPLAINT', name: 'Shikoyatlar' },
          { id: 'SUGGESTION', name: 'Takliflar' },
        ].map((tab) => ({
          ...tab,
          count: tab.id === activeTab ? (data?.page?.totalElements ?? 0) : undefined,
        }))}
        onTabChange={(type) => addParams({ type }, 'page')}
      >
        <DataTable isPaginated data={data || []} columns={columns} className="h-[calc(100svh-320px)]" />
      </TabsLayout>
    </div>
  );
};

export default RegisterEquipmentAppealList;

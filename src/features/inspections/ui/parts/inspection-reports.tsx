// path: src/features/inspections/ui/parts/inspection-reports.tsx
import { useAuth } from '@/shared/hooks/use-auth';
import { DataTable } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format, formatDate } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import InspectionChecklistFormV2 from '@/features/inspections/ui/parts/inspection-checklist-form-v2';
import { InspectionStatus, InspectionSubMenuStatus } from '@/widgets/inspection/ui/inspection-widget';
import { useState } from 'react';
import { useData } from '@/shared/hooks';
import { answerOptions } from '@/features/inspections/ui/parts/inspection-checklist-form';
import { UserRoles } from '@/entities/user';
import { NoData } from '@/shared/components/common/no-data';
import DetailRow from '@/shared/components/common/detail-row';
import FileLink from '@/shared/components/common/file-link';

const InspectionReports = ({ status, acknowledgementPath, resultId }: any) => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState<'questions' | 'eliminated' | 'not_eliminated'>('questions');
  const [tabulation, setTabulation] = useState<'all' | 'positive' | 'negative'>('all');

  const { data: categories = [] } = useData<any[]>(
    `/inspection-checklists`,
    !!resultId,
    {
      resultId,
      positive: currentTab != 'questions' ? currentTab == 'not_eliminated' : null,
      resolved: tabulation != 'all' && currentTab == 'eliminated' ? tabulation == 'positive' : null,
    },
    [],
    6000,
  );

  const columns: ColumnDef<any>[] = [
    ...(currentTab == 'eliminated'
      ? [
          {
            accessorKey: 'question',
            header: 'Aniqlangan kamchilik',
          },
          {
            accessorKey: 'corrective',
            header: 'Chora-tadbir',
          },
          {
            accessorKey: 'deadline',
            size: 100,
            header: 'Bartaraf etish muddati',
            cell: ({ row }: any) => format(new Date(row.original?.deadline), 'dd.MM.yyyy'),
          },
        ]
      : currentTab == 'questions'
        ? [
            {
              accessorKey: 'question',
              size: 300,
              header: 'Savol',
            },
            ...(status == InspectionSubMenuStatus.COMPLETED
              ? [
                  {
                    accessorKey: 'answer',
                    header: 'Javob',
                    cell: ({ row }: any) =>
                      answerOptions?.find((i) => i?.value == row.original?.answer)?.labelKey || '',
                  },
                  {
                    accessorKey: 'deadline',
                    size: 100,
                    header: 'Bartaraf etish muddati',
                    cell: (cell: any) =>
                      cell.row.original.deadline ? formatDate(cell.row.original.deadline, 'dd.MM.yyyy') : '',
                  },
                  {
                    accessorKey: 'corrective',
                    header: 'Chora-tadbir matni',
                  },
                ]
              : []),
          ]
        : [
            {
              accessorKey: 'question',
              header: 'Savol',
            },
            {
              accessorKey: 'answer',
              header: 'Javob',
              cell: ({ row }: any) => answerOptions?.find((i) => i?.value == row.original?.answer)?.labelKey || '',
            },
          ]),
  ];

  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="mt-2">
          <Tabs value={currentTab} onValueChange={(val) => setCurrentTab(val as any)}>
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="questions">Tekshiruv savolnoma</TabsTrigger>
              <TabsTrigger value="eliminated">Kamchilik aniqlandi</TabsTrigger>
              <TabsTrigger value="not_eliminated">Kamchilik aniqlanmadi</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="my-3">
        {currentTab == 'eliminated' && (
          <Tabs value={tabulation} onValueChange={(val) => setTabulation(val as any)}>
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="all">Barchasi</TabsTrigger>
              <TabsTrigger value="negative">Bartaraf etilmadi</TabsTrigger>
              <TabsTrigger value="positive">Bartaraf etildi</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>

      <div>
        {!categories?.length ? (
          <NoData />
        ) : currentTab == 'questions' &&
          user?.role == UserRoles.INSPECTOR &&
          status == InspectionStatus.ASSIGNED &&
          categories?.length ? (
          <InspectionChecklistFormV2
            categories={categories}
            resultId={resultId}
            acknowledgementPath={acknowledgementPath}
          />
        ) : (
          <>
            {currentTab == 'questions' && status == InspectionSubMenuStatus.COMPLETED && (
              <div className="mb-4">
                <DetailRow
                  title="Tilxat fayli:"
                  value={
                    !!acknowledgementPath ? (
                      <div className="flex items-center gap-2">
                        <FileLink url={acknowledgementPath} />
                      </div>
                    ) : (
                      '-'
                    )
                  }
                />
              </div>
            )}
            {categories?.map((category: any) => (
              <div key={category.inspectionCategoryId} className="mb-4 border rounded-xl p-4 bg-white">
                <h3 className="text-lg font-semibold mb-4 text-black-600">{category.categoryName}</h3>
                <DataTable isLoading={false} columns={columns} data={category.checklists || []} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default InspectionReports;

import { useAuth } from '@/shared/hooks/use-auth.ts';
import { useCustomSearchParams, useData } from '@/shared/hooks';
import { UserRoles } from '@/entities/user';
import { DataTable } from '@/shared/components/common/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs.tsx';
import { answerOptions } from '@/features/inspections/ui/parts/inspection-checklist-form';
import { InspectionStatus, InspectionSubMenuStatus } from '@/widgets/inspection/ui/inspection-widget';
import { QK_INSPECTION } from '@/shared/constants/query-keys';

const InspectionReports = ({ checklistCategoryTypeId, status }: any) => {
  const { user } = useAuth();
  const { addParams, paramsObject } = useCustomSearchParams();
  const currentTab = paramsObject?.eliminated || 'questions';
  const tabulation = paramsObject?.tabulation || 'all';

  const { data: questions = [] } = useData<any[]>(
    `/inspection-checklists/by-result/${checklistCategoryTypeId}`,
    !!checklistCategoryTypeId,
    {},
    [QK_INSPECTION],
    6000,
  );

  const columns: ColumnDef<any>[] = [
    ...(currentTab == 'eliminated'
      ? [
          {
            accessorKey: 'defect',
            header: 'Aniqlangan kamchiliklar',
            size: 200,
          },
          {
            accessorKey: 'corrective',
            header: 'Chora-tadbir',
          },
          {
            accessorKey: 'deadline',
            size: 80,
            header: 'Bartaraf etish muddati',
            cell: ({ row }: any) => format(row.original?.deadline, 'dd.MM.yyyy'),
          },
        ]
      : currentTab == 'questions'
        ? [
            {
              accessorKey: 'question',
              header: 'Savol',
            },
            ...(status == InspectionSubMenuStatus.CONDUCTED
              ? [
                  {
                    accessorKey: 'answer',
                    header: 'Javob',
                    cell: ({ row }: any) =>
                      answerOptions?.find((i) => i?.value == row.original?.answer)?.labelKey || '',
                  },
                ]
              : []),
          ]
        : [
            {
              accessorKey: 'corrective',
              header: 'Savolnoma',
            },
            {
              accessorKey: 'date',
              size: 80,
              header: ' Tekshirilgna sana',
              cell: ({ row }: any) => format(row.original?.deadline, 'dd.MM.yyyy'),
            },
          ]),
  ];

  return (
    <div>
      <div className="flex justify-between items-center ">
        <div className="mt-2">
          <Tabs
            value={currentTab || 'questions'}
            onValueChange={(val) => {
              addParams({ eliminated: val, page: 1 });
            }}
          >
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
          <Tabs
            value={tabulation || 'all'}
            onValueChange={(val) => {
              addParams({ tabulation: val, page: 1 });
            }}
          >
            <TabsList className="bg-[#EDEEEE]">
              <TabsTrigger value="all">Barchasi</TabsTrigger>
              <TabsTrigger value="positive">Bartaraf etildi</TabsTrigger>
              <TabsTrigger value="negative">Bartaraf etilmadi</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
      </div>
      <div>
        {currentTab == 'questions' ? (
          <>
            {user?.role == UserRoles.INSPECTOR && status == InspectionStatus.ASSIGNED && questions?.length ? (
              // <InspectionChecklistForm items={questions || []} />
              <></>
            ) : (
              <>
                {questions?.map((category) => (
                  <div key={category.inspectionCategoryId} className="mb-4 border rounded-xl p-4 bg-white">
                    <h3 className="text-lg font-semibold mb-4 text-black-600">{category.categoryName}</h3>
                    <DataTable isLoading={false} columns={columns} data={category.checklists || []} />
                  </div>
                ))}
              </>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default InspectionReports;

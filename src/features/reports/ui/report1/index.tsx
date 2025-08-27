import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import React from 'react';
import { DataTable } from '@/shared/components/common/data-table';
import { usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { ISearchParams } from '@/shared/types';
import Filter from '@/shared/components/common/filter';
import { GoBack } from '@/shared/components/common';

export enum InspectionStatus {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

const Report1: React.FC = () => {
  const { paramsObject, addParams } = useCustomSearchParams();
  const activeTab = paramsObject.ownerType;
  const { data: inspections, isLoading } = usePaginatedData('/reports/appeal-status', {
    ...paramsObject,
    ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
  });

  const handleTabChange = (value: string) => {
    addParams({ ownerType: value });
  };

  function calcPercent(value: number, total: number): string {
    if (!total || total == 0) return '0.0%';
    return ((value / total) * 100).toFixed(2) + '%';
  }

  const columns: ColumnDef<ISearchParams>[] = [
    {
      header: 'Tr',
      cell: ({ row }) => row.index + 1,
    },
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
    },
    {
      header: 'Jami',
      columns: [
        {
          header: 'dona',
          cell: ({ row }) => row.original.total,
        },
        {
          header: '%',
          cell: ({ row }) => calcPercent(row.original.total, row.original.total),
        },
      ],
    },
    {
      header: 'Shu jumladan, statuslar bo‘yicha',
      columns: [
        {
          header: 'Ijroda',
          columns: [
            {
              header: 'dona',
              cell: ({ row }) => row.original.inProcess,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.inProcess, row.original.total),
            },
          ],
        },
        {
          header: 'Kelishishda',
          columns: [
            {
              header: 'dona',
              cell: ({ row }) => row.original.inAgreement,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.inAgreement, row.original.total),
            },
          ],
        },
        {
          header: 'Tasdiqlashda',
          columns: [
            {
              header: 'dona',
              cell: ({ row }) => row.original.inApproval,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.inApproval, row.original.total),
            },
          ],
        },
        {
          header: 'Yakunlangan',
          columns: [
            {
              header: 'dona',
              cell: ({ row }) => row.original.completed,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.completed, row.original.total),
            },
          ],
        },
        {
          header: 'Rad etilgan',
          columns: [
            {
              header: 'dona',
              cell: ({ row }) => row.original.rejected,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.rejected, row.original.total),
            },
          ],
        },
        {
          header: 'Qaytarilgan',
          columns: [
            {
              header: 'dona',
              cell: ({ row }) => row.original.canceled,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.canceled, row.original.total),
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <GoBack title="Jismoniy va yuridik shaxslardan yuborilgan arizalarni hududlar kesimida taqsimlanishi" />
      </div>

      <Tabs value={activeTab || InspectionStatus.INDIVIDUAL} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value={InspectionStatus.INDIVIDUAL}>Jismoniy shaxslar</TabsTrigger>
          <TabsTrigger value={InspectionStatus.LEGAL}>Yuridik shaxslar</TabsTrigger>
        </TabsList>
        <div className="my-4">
          <Filter inputKeys={['startDate', 'endDate']} />
        </div>
        <TabsContent value={InspectionStatus.INDIVIDUAL}>
          <DataTable
            showNumeration={false}
            headerCenter={true}
            data={inspections || []}
            columns={columns as unknown as any}
            isLoading={isLoading}
            className="h-[calc(100vh-300px)]"
          />
        </TabsContent>
        <TabsContent value={InspectionStatus.LEGAL}>
          <DataTable
            showNumeration={false}
            headerCenter={true}
            data={inspections || []}
            columns={columns as unknown as any}
            isLoading={isLoading}
            className="h-[calc(100vh-320px)]"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Report1;

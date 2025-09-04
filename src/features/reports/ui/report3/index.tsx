import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import React from 'react';
import { DataTable } from '@/shared/components/common/data-table';
import { usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import Filter from '@/shared/components/common/filter';
import { GoBack } from '@/shared/components/common';

export enum InspectionStatus {
  LEGAL = 'LEGAL',
  INDIVIDUAL = 'INDIVIDUAL',
}

interface IReportData {
  officeName: string;
  activeHf: number;
  inactiveHf: number;
  activeEquipment: number;
  inactiveEquipment: number;
  expiredEquipment: number;
  activeIrs: number;
  inactiveIrs: number;

  [key: string]: any;
}

const Report1: React.FC = () => {
  const { paramsObject } = useCustomSearchParams();
  const { data: inspections, isLoading } = usePaginatedData<any>('/reports/registry', {
    ...paramsObject,
    ownerType: paramsObject?.ownerType || InspectionStatus.INDIVIDUAL,
    date: paramsObject?.startDate,
  });

  function calcPercent(value: number, total: number): string {
    if (!total || total === 0) return '0.00%';
    return ((value / total) * 100).toFixed(2) + '%';
  }

  const data: any = inspections as unknown as any;
  const totals = React.useMemo(() => {
    const initialTotals = {
      activeHf: 0,
      inactiveHf: 0,
      activeEquipment: 0,
      inactiveEquipment: 0,
      expiredEquipment: 0,
      activeIrs: 0,
    };

    if (!data || data.length === 0) {
      return initialTotals;
    }

    return data.reduce(
      (acc: any, currentItem: any) => {
        for (const key in initialTotals) {
          acc[key as keyof typeof initialTotals] += currentItem[key] || 0;
        }
        return acc;
      },
      { ...initialTotals },
    );
  }, [data]);

  const columns: ColumnDef<IReportData>[] = [
    {
      header: 'T/r',
      cell: ({ row }) => row.index + 1,
      size: 50,
    },
    {
      header: 'Hududiy boshqarma/bo‘limlar',
      accessorKey: 'officeName',
      minSize: 250,
    },
    {
      header: 'XICHO', // Хавфли ишлаб чиқариш объекти
      columns: [
        {
          header: 'Reyestrda amalda',
          columns: [
            {
              header: 'dona',
              accessorKey: 'activeHf',
              size: 80,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.activeHf, totals.activeHf),
              size: 80,
            },
          ],
        },
        {
          header: 'Reyestrdan chiqarilgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'inactiveHf',
              size: 80,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.inactiveHf, totals.inactiveHf),
              size: 80,
            },
          ],
        },
      ],
    },
    {
      header: 'Qurilmalar',
      columns: [
        {
          header: 'Reyestrda amalda',
          columns: [
            {
              header: 'dona',
              accessorKey: 'activeEquipment',
              size: 80,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.activeEquipment, totals.activeEquipment),
              size: 80,
            },
          ],
        },
        {
          header: 'Reyestrdan chiqarilgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'inactiveEquipment',
              size: 80,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.inactiveEquipment, totals.inactiveEquipment),
              size: 80,
            },
          ],
        },
        {
          header: 'Ko‘rik va ishlatish muddati o‘tgan',
          columns: [
            {
              header: 'dona',
              accessorKey: 'expiredEquipment',
              size: 80,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.expiredEquipment, totals.expiredEquipment),
              size: 80,
            },
          ],
        },
      ],
    },
    {
      header: 'INM', // Ишлаб чиқариш назорати маълумотномаси
      columns: [
        {
          header: 'Reyestrda amalda',
          columns: [
            {
              header: 'dona',
              accessorKey: 'activeIrs',
              size: 80,
            },
            {
              header: '%',
              cell: ({ row }) => calcPercent(row.original.activeIrs, totals.activeIrs),
              size: 80,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <GoBack title="Davlat ro‘yxatiga kiritilgan va ro‘yxatdan chiqarilgan XICHO, qurilmalar va IIMlarni hududlar kesimida taqsimlanishi" />
      </div>

      <div className="my-4">
        <Filter inputKeys={['startDate']} />
      </div>
      <DataTable
        showNumeration={false}
        headerCenter={true}
        data={inspections || []}
        columns={columns as unknown as any}
        isLoading={isLoading}
        className="h-[calc(100vh-300px)]"
      />
    </div>
  );
};

export default Report1;

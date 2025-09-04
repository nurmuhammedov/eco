import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { DataTable, DataTableRowActions } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { getDate } from '@/shared/utils/date';
import { useNavigate } from 'react-router-dom';

export const CadastreList = () => {
  const { t } = useTranslation('common');
  const { paramsObject } = useCustomSearchParams();
  const navigate = useNavigate();
  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>('/cadastre-passports', {
    page: paramsObject?.page || 1,
    size: paramsObject?.size || 10,
  });

  const columns: ColumnDef<any>[] = [
    {
      header: t('TXYZ kadastr pasportining hisobga olish raqami'),
      accessorKey: 'registryNumber',
    },
    {
      header: t('TXYZ kadastr pasportining hisobga olish sanasi'),
      accessorFn: (row) => getDate(row.createdAt),
    },
    {
      header: t('XICHO nomi (mavjud bo‘lsa)'),
      accessorKey: 'hfName',
    },
    {
      header: t('XICHO manzili'),
      accessorKey: 'hfAddress',
    },
    {
      header: t('XICHOga egalik qiluvchi yuridik shaxs nomi'),
      accessorKey: 'legalName',
    },
    {
      header: t('Tashkilot STIR'),
      accessorKey: 'legalTin',
    },
    {
      header: t('TXYZ manzili'),
      accessorKey: 'legalAddress',
    },
    {
      id: 'actions',
      header: 'Amallar',
      cell: ({ row }: any) => {
        return (
          <div className="flex gap-2">
            <DataTableRowActions
              row={row}
              showView
              onView={() => navigate(`/cadastre/detail/${row.original.appealId}?id=${row.original.id}`)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      isPaginated
      data={data || []}
      columns={columns}
      isLoading={isLoading}
      className="h-[calc(100svh-220px)]"
    />
  );
};

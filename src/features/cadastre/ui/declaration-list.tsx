import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { DataTable } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const DeclarationList = () => {
  const { t } = useTranslation('common');
  const { paramsObject } = useCustomSearchParams();
  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>('/declarations', {
    page: paramsObject?.page || 1,
    size: paramsObject?.size || 10,
  });

  const columns: ColumnDef<any>[] = [
    {
      header: t('risk_analysis_columns.registryNumber'),
      accessorKey: 'registryNumber',
    },
    {
      header: t('XICHO nomi'),
      accessorKey: 'hfName',
    },
    {
      header: t('XICHO manzili'),
      accessorKey: 'hfAddress',
    },
    {
      header: t('XICHOning hisobga olish raqami'),
      accessorKey: 'hfRegistryNumber',
    },
    {
      header: t('Deklaratsiya ishlab chiqqan tashkilot'),
      accessorKey: 'producingOrganizationName',
    },
    {
      header: t('Deklaratsiya ishlab chiqqan tashkilot STIR'),
      accessorKey: 'producingOrganizationTin',
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

import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { DataTable } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

export const CadastreList = () => {
  const { t } = useTranslation('common');
  const { paramsObject } = useCustomSearchParams();
  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>('/cadastre-passports', {
    page: paramsObject?.page || 1,
    size: paramsObject?.size || 10,
  });

  const columns: ColumnDef<any>[] = [
    {
      header: t('risk_analysis_columns.registryNumber'),
      accessorKey: 'registryNumber',
    },
    {
      header: t('risk_analysis_columns.name'),
      accessorKey: 'name',
    },
    {
      header: t('risk_analysis_columns.legalName'),
      accessorKey: 'legalName',
    },
    {
      header: t('risk_analysis_columns.legalTin'),
      accessorKey: 'legalTin',
    },
    {
      header: t('risk_analysis_columns.address'),
      accessorKey: 'address',
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

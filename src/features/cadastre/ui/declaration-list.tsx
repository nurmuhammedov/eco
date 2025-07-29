import { RiskAnalysisItem } from '@/entities/risk-analysis/models/risk-analysis.types';
import { DataTable } from '@/shared/components/common/data-table';
import { useCustomSearchParams, usePaginatedData } from '@/shared/hooks';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { getDate } from '@/shared/utils/date';

export const DeclarationList = () => {
  const { t } = useTranslation('common');
  const { paramsObject } = useCustomSearchParams();
  const { data, isLoading } = usePaginatedData<RiskAnalysisItem>('/declarations', {
    page: paramsObject?.page || 1,
    size: paramsObject?.size || 10,
  });

  const columns: ColumnDef<any>[] = [
    {
      header: t('Sanoat deklaratsiyasining ro‘yxat raqami'),
      accessorKey: 'registryNumber',
    },
    {
      header: t('Sanoat deklaratsiyasi ro‘yxatga olingan sana'),
      accessorFn: (row) => getDate(row.createdAt),
    },
    {
      header: t('Deklaratsiya qilinayotgan obyektning ro‘yxat raqami'),
      accessorKey: 'hfRegistryNumber',
    },
    {
      header: t('Deklaratsiya qilinayotgan obyektning nomi'),
      accessorKey: 'hfName',
    },
    {
      header: t('Deklaratsiya qilinayotgan obyektning manzili'),
      accessorKey: 'hfAddress',
    },
    {
      header: t('Sanoat deklaratsiyasini ishlab chiqqan tashkilot nomi'),
      accessorKey: 'producingOrganizationName',
    },
    {
      header: t('Sanoat deklaratsiyasini ishlab chiqqan tashkilot STIR'),
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

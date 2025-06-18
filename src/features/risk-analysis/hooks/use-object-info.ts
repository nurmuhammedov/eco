import { useQuery } from '@tanstack/react-query';
import { QK_RISK_ANALYSIS } from '@/shared/constants/query-keys.ts';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { riskAnalysisDetailApi } from '@/features/risk-analysis/model/risk-analysis-detail.api.ts';

export const useObjectInfo = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  let currentType = searchParams.get('type') || '';
  const currentId = searchParams.get('id') || '';

  if (currentType !== 'hf' && currentType !== 'irs') {
    currentType = 'equipments';
  }

  return useQuery({
    queryKey: [QK_RISK_ANALYSIS, 'INFO', currentId, currentType],
    enabled: !!currentId,
    queryFn: () => riskAnalysisDetailApi.getObjectInfo({ type: currentType, id: currentId }),
    select: (data) => {
      const fileNamePrefix = currentType !== 'equipments' ? currentType.toUpperCase() : data.type;

      const files = Object.entries(data?.files)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.${fileNamePrefix}.${file[0]}`;
          return { label: t(label), path: file[1] };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

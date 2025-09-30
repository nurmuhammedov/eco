import { hfDetailApi } from '@/features/register/hf/model/hf-detail.api.ts';
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const useHfDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_REGISTRY, 'HF', id],
    enabled: !!id,
    queryFn: () => hfDetailApi.getDetail(id),
    select: (data) => {
      const files = Object.entries(data?.files)
        .filter(([label]) => label.includes('Path'))
        .map(([key, value]) => {
          const label = `labels.HF.${key || 'file'}`;
          // return { label: t(label), data: value || ''};
          return { label: t(label), data: value as string, fieldName: key };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

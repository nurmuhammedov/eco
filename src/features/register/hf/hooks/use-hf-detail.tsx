import { useQuery } from '@tanstack/react-query';
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { hfDetailApi } from '@/features/register/hf/model/hf-detail.api.ts';

export const useHfDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_REGISTRY, 'HF', id],
    enabled: !!id,
    queryFn: () => hfDetailApi.getDetail(id),
    select: (data) => {
      const files = Object.entries(data?.files)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.HF.${file[0]}`;
          return { label: t(label), path: file[1] };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

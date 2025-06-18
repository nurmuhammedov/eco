import { useQuery } from '@tanstack/react-query';
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { irsDetailApi } from '@/features/register/irs/model/irs-detail.api.ts';

export const useIrsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_REGISTRY, 'irs', id],
    enabled: !!id,
    queryFn: () => irsDetailApi.getDetail(id),
    select: (data) => {
      const files = Object.entries(data?.files)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.IRS.${file[0]}`;
          return { label: t(label), path: file[1] };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

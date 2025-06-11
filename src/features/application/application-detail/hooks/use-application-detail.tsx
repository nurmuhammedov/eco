import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { applicationDetailApi } from '../model/application-detail.api.ts';

export const useApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_APPLICATIONS, id],
    enabled: !!id,
    queryFn: () => applicationDetailApi.getApplicationDetail(id),
    select: (data) => {
      const files = Object.entries(data.data?.files)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.${data.appealType.replace('REGISTER_', '')}.${file[0]}`;
          return { label: t(label), path: file[1] };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

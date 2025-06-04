import { useQuery } from '@tanstack/react-query';
import { applicationDetailApi } from '../model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useParams } from 'react-router-dom';
import getApplicationFields from '@/features/application/application-detail/model/get-application-fields.ts';
import { useTranslation } from 'react-i18next';

export const useApplicationDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_APPLICATIONS, id],
    enabled: !!id,
    queryFn: () => applicationDetailApi.getApplicationDetail(id),
    select: (data) => {
      const files = Object.entries(data.data)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.${data.appealType.replace('REGISTER_', '')}.${file[0]}`;
          return { label: t(label), path: file[1] };
        });
      const fields = Object.entries(data.data)
        .filter(([label]) => !label.includes('Path'))
        .map((file) => {
          return file[0];
        });
      console.log(data?.appealType);
      console.log(getApplicationFields(data?.appealType, fields));

      return {
        ...data,
        files
      };
    }
  });
};

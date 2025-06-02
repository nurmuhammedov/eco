import { useQuery } from '@tanstack/react-query';
import { applicationDetailApi } from '../model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { useParams } from 'react-router-dom';

export const useApplicationDetail = () => {
  const { id } = useParams();

  return useQuery({
    queryKey: [QK_APPLICATIONS, id],
    enabled: !!id,
    queryFn: () => applicationDetailApi.getApplicationDetail(id),
    select: (data) => {
      const files = Object.entries(data.data)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          return { label: file[0], path: file[1] };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

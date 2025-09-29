import { APPLICATION_LOGS } from '@/shared/constants/query-keys.ts';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { applicationDetailApi } from '../model/application-detail.api.ts';

export const useApplicationLogs = () => {
  const { id } = useParams();
  return useQuery({
    queryKey: [APPLICATION_LOGS, id],
    enabled: !!id,
    queryFn: () => applicationDetailApi.getApplicationLogs(id),
  });
};

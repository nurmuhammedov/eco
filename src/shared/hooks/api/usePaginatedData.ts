import { CommonService } from '@/shared/api/dictionaries/queries/comon.api';
import { ISearchParams, ResponseData } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const usePaginatedData = <T>(endpoint: string, params?: ISearchParams, enabled: boolean = true) => {
  const { i18n } = useTranslation();
  const queryMethods = useQuery<ResponseData<T>, Error>({
    queryKey: [endpoint, params, i18n.language],
    queryFn: () => CommonService.getPaginatedData<T>(endpoint, params),
    enabled,
    staleTime: 0,
  });

  const { content = [], page } = queryMethods.data || {};

  return {
    ...queryMethods,
    data: Array.isArray(queryMethods.data) ? queryMethods.data : content,
    totalPages: page?.totalPages,
  };
};

export default usePaginatedData;

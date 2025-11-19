import { CommonService } from '@/shared/api/dictionaries/queries/comon.api';
import { ISearchParams } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const useData = <T>(
  endpoint: string,
  enabled: boolean = true,
  params?: ISearchParams,
  keys: (string | number)[] = [],
  staleTime: number = 600000,
) => {
  const { i18n } = useTranslation();

  return useQuery<T, Error>({
    queryKey: [endpoint, params, i18n.language, ...keys],
    queryFn: () => CommonService.getData<T>(endpoint, params),
    enabled,
    staleTime,
  });
};

export default useData;

import { usePaginatedData } from '@/shared/hooks';
import { ISearchParams } from '@/shared/types';

export const useAttestationList = (params: ISearchParams) => {
  return usePaginatedData<any>('/attestation', params);
};

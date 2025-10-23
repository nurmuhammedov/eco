import { useQuery } from '@tanstack/react-query';
import { applicationDetailApi } from '../model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';

// `enabled` parametri endi majburiy va standart qiymatga ega emas
export const useLegalIipInfo = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: [QK_APPLICATIONS, 'APLICANT_INFO', id],
    queryFn: () => applicationDetailApi.getLegalIipInfo(id),
    // `enabled` shartini tashqaridan kelgan qiymatga to'liq ishonamiz
    enabled: enabled,
  });
};

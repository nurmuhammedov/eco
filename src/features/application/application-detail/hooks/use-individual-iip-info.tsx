import { useQuery } from '@tanstack/react-query';
import { applicationDetailApi } from '../model/application-detail.api.ts';
import { QK_APPLICATIONS } from '@/shared/constants/query-keys.ts';
import { format } from 'date-fns';

export const useIndividualIipInfo = (pin: string, birthDate: Date | undefined, enabled: boolean) => {
  return useQuery({
    queryKey: [QK_APPLICATIONS, 'INDIVIDUAL_INFO', pin, birthDate],
    queryFn: () => {
      // ✅ 2-QADAM: `birthDate` MAVJUDLIGINI TEKSHIRAMIZ
      // Agar `enabled` `false` bo'lsa, `birthDate` `undefined` bo'lishi mumkin.
      // Bu `format` funksiyasi xato berishini oldini oladi.
      if (!birthDate) {
        // Agar sana bo'lmasa, so'rov yuborishning ma'nosi yo'q.
        // `enabled: false` bo'lgani uchun bu `queryFn` baribir ishlamaydi,
        // lekin tip xavfsizligi uchun bu tekshiruv muhim.
        return Promise.reject(new Error('birthDate is required'));
      }

      const formattedDate = format(birthDate, 'yyyy-MM-dd');
      return applicationDetailApi.getIndividualIipInfo(pin, formattedDate);
    },
    enabled: enabled,
  });
};

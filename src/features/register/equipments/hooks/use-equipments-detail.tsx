import { equipmentsDetailApi } from '@/features/register/equipments/model/equipments-detail.api.ts';
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export const useEquipmentsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_REGISTRY, 'equipments', id],
    enabled: !!id,
    queryFn: () => equipmentsDetailApi.getDetail(id),
    select: (data) => {
      const files = Object.entries(data?.files)
        .filter(([label]) => label.includes('Path'))
        .map(([key, value]) => {
          const label = `labels.${data.type || 'HF'}.${key || 'file'}`;
          // return { label: t(label), data: file[1] };
          return { label: t(label), data: value as string, fieldName: key };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

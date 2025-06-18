import { useQuery } from '@tanstack/react-query';
import { QK_REGISTRY } from '@/shared/constants/query-keys.ts';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { equipmentsDetailApi } from '@/features/register/equipments/model/equipments-detail.api.ts';

export const useEquipmentsDetail = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  return useQuery({
    queryKey: [QK_REGISTRY, 'equipments', id],
    enabled: !!id,
    queryFn: () => equipmentsDetailApi.getDetail(id),
    select: (data) => {
      const files = Object.entries(data?.files)
        .filter(([label, value]) => label.includes('Path') && !!value)
        .map((file) => {
          const label = `labels.${data.type}.${file[0]}`;
          return { label: t(label), path: file[1] };
        });
      return {
        ...data,
        files,
      };
    },
  });
};

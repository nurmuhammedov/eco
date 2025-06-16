// src/features/risk-analysis/hooks/use-assign-inspector.ts

import { apiClient } from '@/shared/api';
import useCustomSearchParams from '@/shared/hooks/api/useSearchParams';
import { useAuth } from '@/shared/hooks/use-auth';
import { RiskAnalysisTab } from '@/widgets/risk-analysis/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AssignInspectorPayload {
  inspectorId: string;
  objectId: string;
}

const getEndpoint = (type: RiskAnalysisTab) => {
  switch (type) {
    case RiskAnalysisTab.XICHO:
      return '/assign-inspector-hf';
    case RiskAnalysisTab.INM:
      return '/assign-inspector-irs';
    case RiskAnalysisTab.ATTRACTION:
    case RiskAnalysisTab.LIFT:
      return '/assign-inspector-equipments';
    default:
      throw new Error('Invalid risk analysis type');
  }
};

export const useAssignInspector = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { paramsObject } = useCustomSearchParams();

  const type = paramsObject.mainTab ?? (RiskAnalysisTab.XICHO as RiskAnalysisTab);
  const intervalId = user?.interval?.id;

  return useMutation({
    mutationFn: (payload: AssignInspectorPayload) => {
      const endpoint = getEndpoint(type);
      return apiClient.post(endpoint, {
        ...payload,
        intervalId,
      });
    },
    onSuccess: () => {
      toast.success('Inspektor muvaffaqiyatli biriktirildi!');
      queryClient.invalidateQueries({ queryKey: ['risk-analysis', type] });
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Xatolik yuz berdi');
    },
  });
};

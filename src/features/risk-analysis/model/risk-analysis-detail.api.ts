import { apiClient } from '@/shared/api';

export const riskAnalysisDetailApi = {
  rejectRiskItem: async ({ type, data }: { type: any, data: any }) => {
    const { data: res } = await apiClient.post<any>(`/${type}-risk-indicators`, data);
    return res.data;
  },
  getRiskItems: async (params:any) => {
    const { data } = await apiClient.get<any>(`/hf-risk-indicators/for-one`, params);
    return data.data;
  }


};

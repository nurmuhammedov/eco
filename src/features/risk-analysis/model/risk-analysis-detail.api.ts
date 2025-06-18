import { apiClient } from '@/shared/api';

export const riskAnalysisDetailApi = {
  rejectRiskItem: async ({ type, data }: { type: any; data: any }) => {
    const { data: res } = await apiClient.post<any>(`/${type}-risk-indicators`, data);
    return res.data;
  },
  getRiskItems: async (params: any, type: any) => {
    const { data } = await apiClient.get<any>(`/${type}-risk-indicators/for-one`, params);
    return data.data;
  },
  attachFile: async ({ type, data, id }: { type: any; data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/${type}-risk-indicators/${id}`, data);
    return res.data;
  },
  cancelPoints: async ({ type, data, id }: { type: any; data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/${type}-risk-indicators/cancel/${id}`, data);
    return res.data;
  },
  getObjectInfo: async ({ type, id }: { type: any; id: any }) => {
    const { data } = await apiClient.get<any>(`/${type}/${id}`);
    return data.data;
  },
};

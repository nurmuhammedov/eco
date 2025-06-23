import { apiClient } from '@/shared/api';

export const inspectionsApi = {
  getObjectList: async (params: any, type: any) => {
    const { data } = await apiClient.get<any>(`/risk-assessments/${type}`, params);
    return data.data;
  },
  attachInspectors: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspections/set-inspector/${id}`, data);
    return res.data;
  },
};

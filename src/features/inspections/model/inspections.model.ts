import { apiClient } from '@/shared/api';

export const inspectionsApi = {
  getObjectList: async (params: any, type: any) => {
    const { data } = await apiClient.get<any>(`/risk-assessments/${type}`, params);
    return data.data;
  },
  getInspectionDetail: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspections/${id}`);
    return data.data;
  },
  attachInspectors: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspections/set-inspector/${id}`, data);
    return res.data;
  },
  setFiles: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspections/set-files/${id}`, data);
    return res.data;
  },
  addInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-reports/${id}`, data);
    return res.data;
  },
  editInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/inspection-reports/${id}`, data);
    return res.data;
  },
  getInspectionList: async (id: any) => {
    const { data } = await apiClient.get<any>(`/inspection-reports/${id}`);
    return data.data;
  },
  rejectInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.put<any>(`/inspection-reports-executions/${id}`, data);
    return res.data;
  },
  acceptInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.patch<any>(`/inspection-reports-executions/${id}`, data);
    return res.data;
  },
  addFileToInspectionReport: async ({ data, id }: { data: any; id: any }) => {
    const { data: res } = await apiClient.post<any>(`/inspection-reports-executions/${id}`, data);
    return res.data;
  },
};
